import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { MeetingHudVotingCompleteEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "meeting.votingcomplete")
    onMeetingEnd(ev: MeetingHudVotingCompleteEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.MeetingEnd,
            d: {
                gameCode: trackedGame.lobby.code,
                ejectedClientId: ev.ejected?.id
            }
        }));
    }
}