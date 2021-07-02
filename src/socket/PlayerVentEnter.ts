import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerEnterVentEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.entervent")
    onPlayerEnterVent(ev: PlayerEnterVentEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerVentEnter,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
                ventId: ev.ventid
            }
        }));
    }
}