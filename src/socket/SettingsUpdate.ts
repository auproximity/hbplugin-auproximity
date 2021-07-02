import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerSyncSettingsEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.syncsettings")
    onPlayerSetHost(ev: PlayerSyncSettingsEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.SettingsUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                map: ev.settings.map,
                crewmateVision: ev.settings.crewmateVision
            }
        }));
    }
}