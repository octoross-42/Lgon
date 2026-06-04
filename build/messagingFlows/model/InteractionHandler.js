export class InteractionHandler {
    deferKind;
    constructor(deferKind) {
        this.deferKind = deferKind;
    }
    enable() { return (true); }
}
export class ButtonHandler extends InteractionHandler {
}
export class SelectHandler extends InteractionHandler {
}
