export class Command {
    meta;
    msgsCache;
    logger;
    constructor(meta, msgsCache, logger) {
        this.meta = meta;
        this.msgsCache = msgsCache;
        this.logger = logger;
    }
    getMainCategory() {
        if (this.meta.category.length > 0)
            return (this.meta.category[0]);
        return ("");
    }
}
