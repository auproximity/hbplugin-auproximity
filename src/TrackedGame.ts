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
    Destroy = "DESTROY",
    HostUpdate = "HOST_UPDATE",
    PlayerMove = "PLAYER_MOVE",
    PlayerUpdate = "PLAYER_UPDATE",
    SettingsUpdate = "SETTINGS_UPDATE",
    GameStart = "GAME_START",
    GameEnd = "GAME_END",
    MeetingStart = "MEETING_START",
    MeetingEnd = "MEETING_END",
    PlayerKill = "PLAYER_KILL",
    ImpostorsUpdate = "IMPOSTORS_UPDATE",
    CamsPlayerJoin = "CAMS_PLAYER_JOIN",
    CamsPlayerLeave = "CAMS_PLAYER_LEAVE",
    CommsSabotage = "COMMS_SABOTAGE",
    CommsRepair = "COMMS_REPAIR",
    PlayerVentEnter = "PlAYER_VENT_ENTER",
    PlayerVentExit = "PLAYER_VENT_EXIT"
}