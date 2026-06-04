export class InteractionHandler {
    deferKind;
    kind;
    viewStore;
    flowRunner;
    logger;
    constructor(deferKind, kind, viewStore, flowRunner, logger) {
        this.deferKind = deferKind;
        this.kind = kind;
        this.viewStore = viewStore;
        this.flowRunner = flowRunner;
        this.logger = logger;
    }
}
export class ButtonHandler extends InteractionHandler {
    constructor(deferKind, viewStore, flowRunner, logger) { super(deferKind, "button", viewStore, flowRunner, logger); }
}
export class SelectHandler extends InteractionHandler {
    constructor(deferKind, viewStore, flowRunner, logger) { super(deferKind, "select", viewStore, flowRunner, logger); }
}
