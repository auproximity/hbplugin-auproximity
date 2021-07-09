import ws from "ws";

import { Room } from "@skeldjs/hindenburg";
import { GameOptions } from "@skeldjs/protocol";

export class TrackedGame {
    lastSettings: GameOptions;
    receivedPong: boolean;

    constructor(
        public readonly room: Room,
        public readonly socket: ws
    ) {
        this.lastSettings = new GameOptions(room.settings);
        this.receivedPong = true;
    }
}

export enum IdentifyError {
    GameNotFound = "GAME_NOT_FOUND",
    AlreadyTracked = "ALREADY_TRACKED",
    FailedToPong = "FAILED_TO_PONG"
}

export enum TransportOp {
    Hello = "HELLO",
    Ping = "PING",
    Pong = "PONG",
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