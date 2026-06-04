import { InteractionRegistry } from "../context/modules/InteractionRegistry.js";
import { AddRoleHandler } from "./flows/Lobby/interactions/add_role.js";
import { BasicSelectHandler } from "./flows/Lobby/interactions/basic_select.js";
import { CancelMsgHandler } from "./flows/Lobby/interactions/cancel_msg.js";
export function loadInteractions(viewStore, gameStore, userStore, flowRunner, logger) {
    return new InteractionRegistry({
        "add_role": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "rm_role": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "join_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "leave_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "pause_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "restart_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "start_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "switch_game": new AddRoleHandler(gameStore, viewStore, flowRunner, logger),
        "cancel_msg": new CancelMsgHandler(viewStore, flowRunner, logger)
    }, {
        "choose_role": new BasicSelectHandler(viewStore, flowRunner, logger)
    }, logger);
}
