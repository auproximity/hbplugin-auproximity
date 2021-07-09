import { EventListener, Room } from "@skeldjs/hindenburg";
import { PlayerMoveEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.move")
    onPlayerMove(ev: PlayerMoveEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerMove,
            d: {
                gameCode: trackedGame.room.code,
                clientId: ev.player.id,
                x: ev.position.x,
                y: ev.position.y
            }
        }));
    }
}