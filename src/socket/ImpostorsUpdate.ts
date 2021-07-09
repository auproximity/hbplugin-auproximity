import { EventListener, Room } from "@skeldjs/hindenburg";
import { PlayerSetImpostorsEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.setimpostors")
    onSetImpostors(ev: PlayerSetImpostorsEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.ImpostorsUpdate,
            d: {
                gameCode: trackedGame.room.code,
                clientIds: ev.impostors
                    .map(impostor => impostor.id)
            }
        }));
    }
}