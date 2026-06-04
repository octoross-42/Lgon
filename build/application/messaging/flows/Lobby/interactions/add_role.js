import { ButtonHandler } from "../../../../messaging/model/InteractionHandler.js";
export class AddRoleHandler extends ButtonHandler {
    gameStore;
    constructor(gameStore, viewStore, flowRunner, logger) {
        super("update", viewStore, flowRunner, logger);
        this.gameStore = gameStore;
    }
    async run(authorId, viewId) {
        const view = this.viewStore.get(viewId);
        if (!view) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "view", whatId: viewId, ctx: `add_role handler triggered by ${authorId}` } });
            return;
        }
        const game = this.gameStore.get(view.flowData.data.gameId);
        if (!game) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "game", whatId: `${view.flowData.data.gameId}`, ctx: `add_role handler triggered by ${authorId}` } });
            return;
        }
        const select_interaction = view.interactions.flat().find(interaction => (interaction.model.id === "choose_role") && (interaction.model.kind === "select"));
        if (!select_interaction) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "interaction", whatId: "select_role", ctx: `add_role handler triggered by ${authorId}` } });
            return;
        }
        if (!game.add_roles(select_interaction.selected, 1))
            return;
        this.flowRunner.update(view);
    }
}
