import ws from "ws";

import {
    HindenburgPlugin,
    Plugin,
    Lobby,
    Worker
} from "@skeldjs/hindenburg";

import {
    TrackedGame,
    TransportOp,
    IdentifyError
} from "./TrackedGame";

@HindenburgPlugin({
    id: "hbplugin-auproximity",
    version: "1.0.0",
    order: "none"
})
export default class extends Plugin {
    trackedGames: Map<Lobby, TrackedGame>;
    wsSocket: ws.Server;

    constructor(
        public readonly server: Worker,
        public readonly config: any
    ) {
        super(server, config);

        this.trackedGames = new Map;

        this.wsSocket = new ws.Server({ port: 22029 });
        this.wsSocket.on("connection", (socket, req) => {
            const ipAddr = (req.headers["x-forwarded-for"] as unknown as string || req.socket.remoteAddress) as unknown as string;

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
    }

    handleWSMessage(socket: ws, json: any) {
        switch (json.op) {
        case TransportOp.Hello:
            const serverLobby = this.server.lobbies.get(json.d.gameCode);
            if (serverLobby) {
                if (this.trackedGames.get(serverLobby)) {
                    socket.send(JSON.stringify({
                        op: TransportOp.Error,
                        d: {
                            error: IdentifyError.AlreadyTracked,
                            gameCode: json.d.gameCode
                        }
                    }));
                    return;
                }

                const trackedGame = new TrackedGame(serverLobby,  socket);
                this.trackedGames.set(serverLobby, trackedGame);

                socket.send(JSON.stringify({
                    op: TransportOp.Hello,
                    d: {
                        gameCode: json.gameCode
                    }
                }));

                this.sendStateUpdate(trackedGame);
            } else {
                socket.send(JSON.stringify({
                    op: TransportOp.Error,
                    d: {
                        error: IdentifyError.GameNotFound,
                        gameCode: json.d.gameCode
                    }
                }));
            }
            break;
        }
    }

    sendStateUpdate(trackedGame: TrackedGame) {
        if (trackedGame.lobby.host?.info?.name) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.HostUpdate,
                d: {
                    gameCode: trackedGame.lobby.code,
                    name: trackedGame.lobby.host.info.name
                }
            }));
        } else {
            return this.logger.warn("Wanted to send host update for %s, but there was no host.",
                trackedGame.lobby);
        }
    }
}