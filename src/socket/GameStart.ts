import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { RoomGameStartEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "room.gamestart")
    onRoomGameStart(ev: RoomGameStartEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.GameStart,
            d: {
                gameCode: trackedGame.lobby.code
            }
        }));
    }
}