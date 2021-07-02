import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerMoveEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.move")
    onPlayerMove(ev: PlayerMoveEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame || !ev.player.info?.name)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerMove,
            d: {
                gameCode: trackedGame.lobby.code,
                name: ev.player.info.name,
                x: ev.position.x,
                y: ev.position.y
            }
        }));
    }
}