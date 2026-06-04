export class MessagingCache {
    msgs;
    n;
    min;
    constructor() {
        this.msgs = new Map();
        this.n = 0;
        this.min = 0;
    }
    static messageHasInteraction(msgBlock) {
        // .interactions.some(interactionRow => (interactionRow.length > 0)) )
        return (true);
    }
    add(contextId, userId, flowDef) {
    }
}
