import ws from "ws";

import { Lobby } from "@skeldjs/hindenburg";

export class TrackedGame {
    constructor(
        public readonly lobby: Lobby,
        public readonly socket: ws
    ) {}
}

export enum IdentifyError {
    GameNotFound = "GAME_NOT_FOUND",
    AlreadyTracked = "ALREADY_TRACKED"
}

export enum TransportOp {
    Hello = "HELLO",
    Error = "ERROR",
    Destroyed = "DESTROYED",
    HostUpdate = "HOST_UPDATE"
}