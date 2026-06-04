export class DiscordMessagingCache {
    msgRefs;
    constructor() {
        this.msgRefs = new Map();
    }
    get(viewId) {
        return (this.msgRefs.get(viewId));
    }
    getChannel(viewId) {
        return (this.msgRefs.get(viewId)?.channelId);
    }
    add(viewId, msgRefs) {
        this.msgRefs.set(viewId, msgRefs);
    }
    rm(viewId) {
        this.msgRefs.delete(viewId);
    }
}
