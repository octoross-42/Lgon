export class InteractionRegistry {
    buttons;
    selects;
    logger;
    constructor(buttons, selects, logger) {
        this.buttons = buttons;
        this.selects = selects;
        this.logger = logger;
    }
    has(interactionName) {
        return (interactionName in this.buttons || interactionName in this.selects);
    }
    async button(interactionName, authorId, contextId) {
        this.logger.event({ code: "INTERACTION", data: { userId: authorId, interaction: interactionName } });
        await this.buttons[interactionName].run(authorId, contextId);
    }
    async select(interactionName, authorId, selected, contextId) {
        this.logger.event({ code: "INTERACTION", data: { userId: authorId, interaction: interactionName } });
        await this.selects[interactionName].run(authorId, selected, contextId);
    }
}
