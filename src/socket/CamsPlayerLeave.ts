import { EventListener, Room } from "@skeldjs/hindenburg";
import { SecurityCameraLeaveEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "security.cameras.leave")
    onPlayerLeavesCameras(ev: SecurityCameraLeaveEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.CamsPlayerLeave,
            d: {
                gameCode: trackedGame.room.code,
                clientId: ev.player.id,
            }
        }));
    }
}