import { LobbyControlsScriptMaker } from "./flows/Lobby/scripts/controls.js";
import { LobbyPlayersScriptMaker } from "./flows/Lobby/scripts/players.js";
import { LobbyRolesScriptMaker } from "./flows/Lobby/scripts/roles.js";
import { LobbyPresetRolesScriptMaker } from "./flows/Lobby/scripts/preset_roles.js";
import { AlreadyJoinedScriptMaker } from "./flows/Notify/scripts/already_join.js";
import { CannotJoinScriptMaker } from "./flows/Notify/scripts/cannot_join.js";
import { CannotLeaveScriptMaker } from "./flows/Notify/scripts/cannot_leave.js";
import { SwitchGameScriptMaker } from "./flows/Lobby/scripts/switchGame.js";
import { InternalErrorScriptMaker } from "./flows/Notify/scripts/internal_error.js";
export function loadScripts(gameStore, userStore, logger) {
    return ({
        "LobbyControls": new LobbyControlsScriptMaker(userStore),
        "LobbyPlayers": new LobbyPlayersScriptMaker(gameStore, userStore, logger),
        "LobbyRoles": new LobbyRolesScriptMaker(gameStore, userStore, logger),
        "LobbyPresetRoles": new LobbyPresetRolesScriptMaker(gameStore, userStore, logger),
        "SwitchGame": new SwitchGameScriptMaker(gameStore, userStore, logger),
        "ALREADY_JOINED": new AlreadyJoinedScriptMaker(),
        "CANNOT_JOIN": new CannotJoinScriptMaker(),
        "CANNOT_LEAVE": new CannotLeaveScriptMaker(),
        "INTERNAL_ERROR": new InternalErrorScriptMaker()
    });
}
