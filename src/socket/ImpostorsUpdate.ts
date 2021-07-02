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
                names: ev.impostors
                    .filter(impostor => !!impostor.info?.name)
                    .map(impostor => impostor.info!.name)
            }
        }));
    }
}