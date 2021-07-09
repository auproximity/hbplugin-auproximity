import { EventListener, Room } from "@skeldjs/hindenburg";
import { PlayerEnterVentEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.entervent")
    onPlayerEnterVent(ev: PlayerEnterVentEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerVentEnter,
            d: {
                gameCode: trackedGame.room.code,
                clientId: ev.player.id,
                ventId: ev.ventid
            }
        }));
    }
}