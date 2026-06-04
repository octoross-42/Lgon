import { SelectHandler } from "../../../../messaging/model/InteractionHandler.js";
export class BasicSelectHandler extends SelectHandler {
    constructor(viewStore, flowRunner, logger) { super("update", viewStore, flowRunner, logger); }
    async run(authorId, selected, contextId) {
        const viewId = contextId;
        const view = this.viewStore.get(viewId);
        if (!view) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "view", whatId: viewId, ctx: `choose_role handler triggered by ${authorId}` } });
            return;
        }
        const select_interaction = view.interactions.flat().find(interaction => (interaction.model.id === "choose_role") && (interaction.model.kind === "select"));
        if (!select_interaction) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "interaction", whatId: "select_role", ctx: `choose_role handler triggered by ${authorId}` } });
            return;
        }
        select_interaction.selected = selected;
    }
}
