import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerSetHostEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.sethost")
    onPlayerSetHost(ev: PlayerSetHostEvent<Lobby>) {
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