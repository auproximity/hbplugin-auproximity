import { EventListener, Room } from "@skeldjs/hindenburg";
import { RoomGameEndEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "room.gameend")
    onRoomGameEnd(ev: RoomGameEndEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.GameEnd,
            d: {
                gameCode: trackedGame.room.code
            }
        }));
    }
}