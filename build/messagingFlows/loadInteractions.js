import { InteractionHandler } from "./model/InteractionHandler.js";
import { InteractionRegistry } from "../application/context/modules/InteractionRegistry.js";
class InteractionReplyTODO extends InteractionHandler {
    constructor() {
        super("update");
    }
    run(authorId) {
        return;
    }
}
export function loadInteractions(gameStore, userStore, flowRunner, logger) {
    return new InteractionRegistry({
        "add_role": new InteractionReplyTODO(),
        "rm_role": new InteractionReplyTODO(),
        "join_game": new InteractionReplyTODO(),
        "leave_game": new InteractionReplyTODO(),
        "pause_game": new InteractionReplyTODO(),
        "restart_game": new InteractionReplyTODO(),
        "start_game": new InteractionReplyTODO(),
        "switch_game": new InteractionReplyTODO(),
    }, {
        "choose_role": new InteractionReplyTODO()
    }, logger);
}
