import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { SecurityCameraLeaveEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "security.cameras.leave")
    onPlayerLeavesCameras(ev: SecurityCameraLeaveEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame || !ev.player.info?.name)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.CamsPlayerLeave,
            d: {
                gameCode: trackedGame.lobby.code,
                name: ev.player.info?.name
            }
        }));
    }
}