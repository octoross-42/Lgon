import { ButtonHandler } from "../../../../messaging/model/InteractionHandler.js";
export class CancelMsgHandler extends ButtonHandler {
    constructor(viewStore, flowRunner, logger) { super("update", viewStore, flowRunner, logger); }
    async run(authorId, viewId) {
        const view = this.viewStore.get(viewId);
        if (!view) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "view", whatId: viewId, ctx: `add_role handler triggered by ${authorId}` } });
            return;
        }
        this.flowRunner.delete(view);
    }
}
