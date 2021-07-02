import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerSetHostEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.sethost")
    onPlayerSetHost(ev: PlayerSetHostEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.HostUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
            }
        }));
    }
}