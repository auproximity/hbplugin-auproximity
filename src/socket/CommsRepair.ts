import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { SystemRepairEvent, SystemType } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "system.repair")
    onSystemRepair(ev: SystemRepairEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        if (ev.system.systemType === SystemType.Communications) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.CommsRepair,
                d: {
                    gameCode: trackedGame.lobby.code
                }
            }));
        }
    }
}