import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { RoomGameEndEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "room.gameend")
    onRoomGameEnd(ev: RoomGameEndEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.GameEnd,
            d: {
                gameCode: trackedGame.lobby.code
            }
        }));
    }
}