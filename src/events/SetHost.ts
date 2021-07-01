import AuproximityPlugin from "..";
import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerSetHostEvent } from "@skeldjs/core";
import { TransportOp } from "../TrackedGame";

export default class {
    @EventListener(AuproximityPlugin, "player.sethost")
    onPlayerSetHost(this: AuproximityPlugin, ev: PlayerSetHostEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame || !ev.player.info?.name)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.HostUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                name: ev.player.info.name
            }
        }));
    }
}