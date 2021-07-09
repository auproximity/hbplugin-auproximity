import ws from "ws";
import util from "util";
import dns from "dns";

import {
    HindenburgPlugin,
    Plugin,
    Room,
    Worker
} from "@skeldjs/hindenburg";

import {
    TrackedGame as TrackedRoom,
    TransportOp,
    IdentifyError as SocketError
} from "./TrackedRoom";
import { SystemType } from "@skeldjs/constant";
import { HudOverrideSystem, SecurityCameraSystem } from "@skeldjs/core";

export interface AuproximityConfig {
    host: string;
    pingInterval: number;
    sourceWhitelist: string[];
}

const CUSTOM_SERVER_PORT = 22044;

const resolveDns = util.promisify(dns.resolve);

@HindenburgPlugin({
    id: "hbplugin-auproximity",
    version: "1.0.0",
    order: "none"
})
export default class extends Plugin {
    trackedRooms: Map<Room, TrackedRoom>;
    socketToRoom: Map<ws, TrackedRoom>;
    pingTimeout!: NodeJS.Timeout;
    ipWhitelist!: string[];
    wsSocket: ws.Server;

    constructor(
        public readonly server: Worker,
        public readonly config: AuproximityConfig
    ) {
        super(server, config);

        this.trackedRooms = new Map;
        this.socketToRoom = new Map;

        this.wsSocket = new ws.Server({
            port: CUSTOM_SERVER_PORT,
            host: this.config.host || "0.0.0.0"
        });
        this.wsSocket.on("connection", (socket, req) => {
            const ipAddr = req.socket.remoteAddress;

            if (!ipAddr) {
                socket.close();
                return this.logger.warn("Could not get IP address from source, not connecting.");
            }

            if (this.ipWhitelist.length && !this.ipWhitelist.includes(ipAddr)) {
                socket.close();
                return this.logger.warn("Got message from non-whitelisted ip address: %s",
                    ipAddr);
            }

            socket.on("message", buffer => {
                const data = buffer.toString("utf8");

                try {
                    const json = JSON.parse(data);
                    try {
                        this.handleWSMessage(socket, json);
                    } catch (e) {
                        this.logger.error("An error occurred while processing websocket message from %s:", ipAddr);
                        console.log(e);
                    }
                } catch (e) {
                    this.logger.warn("Received bad websocket message from %s: %s",
                        ipAddr, data);
                }
            });
        });

        this.onConfigUpdate();
    }

    pingRooms() {
        for (const [ , trackedRoom ] of this.trackedRooms) {
            if (!trackedRoom.receivedPong) {
                trackedRoom.socket.send(JSON.stringify({
                    op: TransportOp.Error,
                    d: {
                        error: SocketError.FailedToPong
                    }
                }));
                this.logger.info("Socket failed to pong last ping for room: %s",
                    trackedRoom.room);
                trackedRoom.socket.close();
                continue;
            }

            trackedRoom.socket.send(JSON.stringify({
                op: TransportOp.Ping,
                d: {}
            }));
            trackedRoom.receivedPong = false;
        }
    }

    async onConfigUpdate() {
        this.pingTimeout = setInterval(this.pingRooms.bind(this), this.config.pingInterval || 10000);

        this.ipWhitelist = [];
        if (this.config.sourceWhitelist) {
            for (const address of this.config.sourceWhitelist) {
                const resolvedIp = await resolveDns(address);
                this.ipWhitelist.push(...resolvedIp);
            }
        }
    }

    handleWSMessage(socket: ws, json: any) {
        switch (json.op) {
        case TransportOp.Hello:
            const serverRoom = this.server.rooms.get(json.d.gameCode);
            if (serverRoom) {
                if (this.trackedRooms.get(serverRoom)) {
                    socket.send(JSON.stringify({
                        op: TransportOp.Error,
                        d: {
                            error: SocketError.AlreadyTracked,
                            gameCode: json.d.gameCode
                        }
                    }));
                    return;
                }

                const trackedRoom = new TrackedRoom(serverRoom,  socket);
                this.trackedRooms.set(serverRoom, trackedRoom);
                this.socketToRoom.set(socket, trackedRoom);

                socket.send(JSON.stringify({
                    op: TransportOp.Hello,
                    d: {
                        gameCode: json.gameCode
                    }
                }));

                this.sendInitialState(trackedRoom);

                this.logger.info("Began tracking game: %s",
                    trackedRoom.room);

                socket.on("close", () => {
                    this.trackedRooms.delete(serverRoom);
                    this.socketToRoom.delete(socket);

                    this.logger.info("Stopped tracking game: %s",
                        trackedRoom.room);
                });
            } else {
                socket.send(JSON.stringify({
                    op: TransportOp.Error,
                    d: {
                        error: SocketError.GameNotFound,
                        gameCode: json.d.gameCode
                    }
                }));
            }
            break;
        case TransportOp.Pong:
            const trackedRoom = this.socketToRoom.get(socket);
            if (trackedRoom) {
                trackedRoom.receivedPong = true;
            }
            break;
        }
    }

    sendInitialState(trackedGame: TrackedRoom) {
        const sendImpostors = [];
        for (const [ , player ] of trackedGame.room.players) {
            if (player.info) {
                trackedGame.socket.send(JSON.stringify({
                    op: TransportOp.PlayerUpdate,
                    d: {
                        gameCode: trackedGame.room.code,
                        clientId: player.id,
                        name: player.info.name,
                        color: player.info.color,
                        hat: player.info.hat,
                        skin: player.info.skin
                    }
                }));

                if (player.info.isDead) {
                    trackedGame.socket.send(JSON.stringify({
                        op: TransportOp.PlayerKill,
                        d: {
                            gameCode: trackedGame.room.code,
                            clientId: player.id
                        }
                    }));
                }

                if (player.info.isImpostor) {
                    sendImpostors.push(player);
                }

                if (player.transform) {
                    trackedGame.socket.send(JSON.stringify({
                        op: TransportOp.PlayerMove,
                        d: {
                            gameCode: trackedGame.room.code,
                            clientId: player.id,
                            x: player.transform.position.x,
                            y: player.transform.position.y
                        }
                    }));
                }

                if (player.physics?.ventid !== -1) {
                    trackedGame.socket.send(JSON.stringify({
                        op: TransportOp.PlayerVentEnter,
                        d: {
                            gameCode: trackedGame.room.code,
                            clientId: player.id,
                            ventId: player.physics.ventid
                        }
                    }));
                }
            }
        }

        if (sendImpostors.length) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.ImpostorsUpdate,
                d: {
                    gameCode: trackedGame.room.code,
                    clientIds: sendImpostors.map(player => player.id)
                }
            }));
        }

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.SettingsUpdate,
            d: {
                gameCode: trackedGame.room.code,
                map: trackedGame.room.settings.map,
                crewmateVision: trackedGame.room.settings.crewmateVision
            }
        }));

        if (trackedGame.room.started) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.GameStart,
                d: {
                    gameCode: trackedGame.room.code
                }
            }));
        }

        if (trackedGame.room.meetinghud) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.MeetingStart,
                d: {
                    gameCode: trackedGame.room.code
                }
            }));
        }

        const shipstatus = trackedGame.room.shipstatus;
        if (shipstatus) {
            const security = shipstatus.systems[SystemType.Security as keyof typeof shipstatus.systems] as unknown as SecurityCameraSystem<Room>;
            if (security) {
                for (const player of security.players) {
                    trackedGame.socket.send(JSON.stringify({
                        op: TransportOp.CamsPlayerJoin,
                        d: {
                            gameCode: trackedGame.room.code,
                            clientId: player.id
                        }
                    }));
                }
            }

            const comms = shipstatus.systems[SystemType.Communications as keyof typeof shipstatus.systems] as unknown as HudOverrideSystem<Room>;
            if (comms.sabotaged) {
                trackedGame.socket.send(JSON.stringify({
                    op: TransportOp.CommsSabotage,
                    d: {
                        gameCode: trackedGame.room.code
                    }
                }));
            }
        }

        if (trackedGame.room.host?.id) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.HostUpdate,
                d: {
                    gameCode: trackedGame.room.code,
                    clientId: trackedGame.room.host.id
                }
            }));
        } else {
            return this.logger.warn("Wanted to send host update for %s, but there was no host.",
                trackedGame.room);
        }
    }
}