import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerMoveEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.move")
    onPlayerMove(ev: PlayerMoveEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerMove,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
                x: ev.position.x,
                y: ev.position.y
            }
        }));
    }
}