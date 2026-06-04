import { makeLgonId } from "../../../../types/LgonId.js";
export class LobbyPlayersScriptMaker {
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
            this.logger.event({ code: "NOT_FOUND", data: { what: "user", whatId: authorId, ctx: "lobby players script maker making" } });
            throw Error(""); // TODO
        }
        let gameId;
        if (!user.game)
            gameId = makeLgonId("game", "null");
        else
            gameId = user.game.meta.id;
        return (new LobbyPlayersScript(gameId, this.gameStore));
    }
}
export class LobbyPlayersScript {
    gameId;
    gameStore;
    constructor(gameId, gameStore) {
        this.gameId = gameId;
        this.gameStore = gameStore;
    }
    make() {
        const game = this.gameStore.get(this.gameId);
        if (!game)
            return ({
                title: "Players",
                fields: [
                    {
                        name: "",
                        value: "Game not found"
                    }
                ]
            });
        const playersIds = game.players.getIds();
        const playersStr = ((playersIds.length > 0) ? "- <@" : "") + playersIds.join(">\n- <@") + ((playersIds.length > 0) ? ">" : "");
        return ({
            title: "Players",
            description: `*\`${this.gameId}\`*`,
            fields: [
                {
                    name: "",
                    value: playersStr
                }
            ]
        });
    }
}
