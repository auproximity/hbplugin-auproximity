import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { SecurityCameraLeaveEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "security.cameras.leave")
    onPlayerLeavesCameras(ev: SecurityCameraLeaveEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.CamsPlayerLeave,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
            }
        }));
    }
}