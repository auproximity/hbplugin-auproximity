import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerMurderEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.murder")
    onPlayerMurder(ev: PlayerMurderEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerKill,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
            }
        }));
    }
}