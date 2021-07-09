import { EventListener, Room } from "@skeldjs/hindenburg";
import { PlayerSetHostEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.sethost")
    onPlayerSetHost(ev: PlayerSetHostEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.HostUpdate,
            d: {
                gameCode: trackedGame.room.code,
                clientId: ev.player.id,
            }
        }));
    }
}