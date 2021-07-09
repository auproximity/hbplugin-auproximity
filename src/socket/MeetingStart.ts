import { EventListener, Room } from "@skeldjs/hindenburg";
import { PlayerStartMeetingEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.startmeeting")
    onMeetingStart(ev: PlayerStartMeetingEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.MeetingStart,
            d: {
                gameCode: trackedGame.room.code
            }
        }));
    }
}