import { EventListener, LobbyDestroyEvent } from "@skeldjs/hindenburg";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "lobby.destroy")
    onLobbyDestroy(ev: LobbyDestroyEvent) {
        const trackedGame = this.trackedGames.get(ev.lobby);

        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.Destroy,
            d: {
                gameCode: trackedGame.lobby.code
            }
        }));
    }
}