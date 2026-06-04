import { ViewStore } from "./ViewStore.js";
export class FlowRunner {
    messenger;
    logger;
    viewStore;
    constructor(messenger, gameStore, userStore, logger) {
        this.messenger = messenger;
        this.logger = logger;
        this.viewStore = new ViewStore(gameStore, userStore, this.logger);
    }
    async run(flow, author, originMsgTarget, ephemeral = false) {
        const views = this.viewStore.new(flow, author, originMsgTarget);
        this.messenger.send(views, author, originMsgTarget, ephemeral);
    }
}
