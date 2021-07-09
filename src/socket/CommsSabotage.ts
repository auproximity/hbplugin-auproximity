import { EventListener, Room } from "@skeldjs/hindenburg";
import { SystemSabotageEvent, SystemType } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "system.sabotage")
    onSystemSabotaged(ev: SystemSabotageEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        if (ev.system.systemType === SystemType.Communications) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.CommsSabotage,
                d: {
                    gameCode: trackedGame.room.code
                }
            }));
        }
    }
}