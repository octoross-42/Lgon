import { makeLgonId } from "../../../../types/LgonId.js";
export class SwitchGameScriptMaker {
    gameStore;
    userStore;
    logger;
    constructor(gameStore, userStore, logger) {
        this.gameStore = gameStore;
        this.userStore = userStore;
        this.logger = logger;
    }
    script(authorId) {
        const user = this.userStore.get(authorId);
        if (!user) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "user", whatId: authorId, ctx: "switch game script maker making" } });
            throw Error(""); // TODO
        }
        let gameId;
        if (!user.game)
            gameId = makeLgonId("game", "null");
        else
            gameId = user.game.meta.id;
        return (new SwitchGameScript(user.id, gameId, this.gameStore, this.userStore, this.logger));
    }
}
export class SwitchGameScript {
    userId;
    switchToId;
    gameStore;
    userStore;
    logger;
    constructor(userId, switchToId, gameStore, userStore, logger) {
        this.userId = userId;
        this.switchToId = switchToId;
        this.gameStore = gameStore;
        this.userStore = userStore;
        this.logger = logger;
    }
    make() {
        const game = this.gameStore.get(this.switchToId);
        if (!game)
            return ({
                title: "Switch Game",
                fields: [
                    {
                        name: "",
                        value: "Game to switch not found"
                    }
                ]
            });
        const user = this.userStore.get(this.userId);
        if (!user) {
            return ({
                title: "Switch Game",
                fields: [
                    {
                        name: "",
                        value: "User not found"
                    }
                ]
            });
        }
        return ({
            title: "Switch Game",
            fields: [
                {
                    name: "\u200b",
                    value: `Do you want to switch game ?\n*From ${(user.game) ? user.game.meta.id : "null"} to ${this.switchToId}*`
                }
            ]
        });
    }
}
