import { EventListener, Room } from "@skeldjs/hindenburg";
import { PlayerExitVentEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.exitvent")
    onPlayerExitVent(ev: PlayerExitVentEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerVentExit,
            d: {
                gameCode: trackedGame.room.code,
                clientId: ev.player.id,
            }
        }));
    }
}