import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerStartMeetingEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.startmeeting")
    onMeetingStart(ev: PlayerStartMeetingEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.MeetingStart,
            d: {
                gameCode: trackedGame.lobby.code
            }
        }));
    }
}