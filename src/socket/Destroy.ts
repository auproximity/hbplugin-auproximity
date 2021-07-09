import { EventListener, RoomDestroyEvent } from "@skeldjs/hindenburg";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "room.destroy")
    onRoomDestroy(ev: RoomDestroyEvent) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.Destroy,
            d: {
                gameCode: trackedGame.room.code
            }
        }));
    }
}