import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerExitVentEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.exitvent")
    onPlayerExitVent(ev: PlayerExitVentEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerVentExit,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
            }
        }));
    }
}