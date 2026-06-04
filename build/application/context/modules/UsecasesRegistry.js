export class UsecasesRegistry {
    usecases;
    logger;
    constructor(usecases, logger) {
        this.usecases = usecases;
        this.logger = logger;
    }
    run(usecaseName, authorId, ...args) {
        this.logger.event({ code: "USECASE", data: { userId: authorId, command: usecaseName } });
        this.usecases[usecaseName].run(authorId, ...args);
    }
}
