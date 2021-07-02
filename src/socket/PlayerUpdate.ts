import { EventListener, Lobby } from "@skeldjs/hindenburg";
import { PlayerExitVentEvent, PlayerSetColorEvent, PlayerSetHatEvent, PlayerSetNameEvent, PlayerSetSkinEvent } from "@skeldjs/core";

import AuproximityPlugin from "../hbplugin-auproximity";
import { TransportOp } from "../TrackedGame";

export default class extends AuproximityPlugin {
    @EventListener(AuproximityPlugin, "player.setcolor")
    onPlayerSetHost(ev: PlayerSetColorEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
                color: ev.newColor
            }
        }));
    }

    @EventListener(AuproximityPlugin, "player.setname")
    onPlayerSetName(ev: PlayerSetNameEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
                name: ev.newName
            }
        }));
    }

    @EventListener(AuproximityPlugin, "player.sethat")
    onPlayerSetHat(ev: PlayerSetHatEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
                hat: ev.newHat
            }
        }));
    }

    @EventListener(AuproximityPlugin, "player.setskin")
    onPlayerSetSkin(ev: PlayerSetSkinEvent<Lobby>) {
        const trackedGame = this.trackedGames.get(ev.room);
        
        if (!trackedGame)
            return;

        trackedGame.socket.send(JSON.stringify({
            op: TransportOp.PlayerUpdate,
            d: {
                gameCode: trackedGame.lobby.code,
                clientId: ev.player.id,
                skin: ev.newSkin
            }
        }));
    }
}