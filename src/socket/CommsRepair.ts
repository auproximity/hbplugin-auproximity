import { EventListener, Room } from "@skeldjs/hindenburg";
import { SystemRepairEvent, SystemType } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedRoom";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "system.repair")
    onSystemRepair(ev: SystemRepairEvent<Room>) {
        const trackedGame = this.trackedRooms.get(ev.room);

        if (!trackedGame)
            return;

        if (ev.system.systemType === SystemType.Communications) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.CommsRepair,
                d: {
                    gameCode: trackedGame.room.code
                }
            }));
        }
    }
}