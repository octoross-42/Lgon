import { ViewStore } from "./ViewStore.js";
export class FlowRunner {
    messenger;
    logger;
    viewStore;
    // private readonly updateOn: Map<LgonId<"">, LgonId<"view">[]>
    constructor(messenger, gameStore, userStore, logger) {
        this.messenger = messenger;
        this.logger = logger;
        this.viewStore = new ViewStore(gameStore, userStore, this.logger);
    }
    async run(flow, author, originMsgTarget, flowData, ephemeral = false) {
        const views = this.viewStore.new(flow, author, originMsgTarget, flowData);
        this.messenger.send(views, originMsgTarget, ephemeral);
    }
    update(view) {
        this.messenger.update(view);
    }
    delete(view) {
        this.messenger.delete(view);
    }
}
