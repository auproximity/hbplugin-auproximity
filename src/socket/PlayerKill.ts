import { EventListener, Room } from "@skeldjs/hindenburg";
import { PlayerMurderEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.murder")
    onPlayerMurder(ev: PlayerMurderEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerKill,
            d: {
                gameCode: trackedGame.room.code,
                clientId: ev.player.id,
            }
        }));
    }
}