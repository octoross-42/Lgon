export class StartGameUsecase {
    gameStore;
    userStore;
    flowRunner;
    logger;
    constructor(gameStore, userStore, flowRunner, logger) {
        this.gameStore = gameStore;
        this.userStore = userStore;
        this.flowRunner = flowRunner;
        this.logger = logger;
    }
    async run(authorId) {
    }
}
