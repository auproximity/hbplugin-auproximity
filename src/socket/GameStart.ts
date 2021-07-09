import { EventListener, Room } from "@skeldjs/hindenburg";
import { RoomGameStartEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "room.gamestart")
    onRoomGameStart(ev: RoomGameStartEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.GameStart,
            d: {
                gameCode: trackedGame.room.code
            }
        }));
    }
}