import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerEnterVentEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.entervent")
    onPlayerEnterVent(ev: PlayerEnterVentEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame || !ev.player.info?.name)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerVentEnter,
            d: {
                gameCode: trackedGame.lobby.code,
                name: ev.player.info.name,
                ventId: ev.ventid
            }
        }));
    }
}