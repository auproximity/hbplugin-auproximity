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

        const dataObject: any = {
            gameCode: trackedGame.lobby.code,
        };

        if (trackedGame.lastSettings.map !== ev.settings.map) {
            dataObject.map = ev.settings.map;
        }

        if (trackedGame.lastSettings.crewmateVision !== ev.settings.crewmateVision) {
            dataObject.crewmateVision = ev.settings.crewmateVision;
        }

        if ("map" in dataObject || "crewmateVision" in dataObject) {
            trackedGame.socket.send(JSON.stringify({
                op: TransportOp.SettingsUpdate,
                d: dataObject
            }));
        }
    }
}