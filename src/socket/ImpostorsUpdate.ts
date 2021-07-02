import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerSetImpostorsEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.setimpostors")
    onSetImpostors(ev: PlayerSetImpostorsEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.ImpostorsUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                clientIds: ev.impostors
                    .map(impostor => impostor.id)
            }
        }));
    }
}