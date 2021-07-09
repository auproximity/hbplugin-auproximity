import { EventListener, Room } from "@skeldjs/hindenburg";
import { MeetingHudVotingCompleteEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "meeting.votingcomplete")
    onMeetingEnd(ev: MeetingHudVotingCompleteEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.MeetingEnd,
            d: {
                gameCode: trackedGame.room.code,
                ejectedClientId: ev.ejected?.id
            }
        }));
    }
}