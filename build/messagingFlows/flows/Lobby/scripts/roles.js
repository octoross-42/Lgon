import { makeLgonId } from "../../../../types/LgonId.js";
export class LobbyRolesScriptMaker {
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
            this.logger.event({ code: "NOT_FOUND", data: { what: "user", whatId: authorId, ctx: "lobby roles script maker making" } });
            throw Error(""); // TODO
        }
        let gameId;
        if (!user.game)
            gameId = makeLgonId("game", "null");
        else
            gameId = user.game.meta.id;
        return (new LobbyRolesScript(gameId, this.gameStore));
    }
}
export class LobbyRolesScript {
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
                title: "Roles",
                fields: [
                    {
                        name: "",
                        value: "Game not found"
                    }
                ]
            });
        const stocks = game.pickedRoles.getStock();
        const rolesStr = (stocks.length > 0) ? ("- " + stocks.map(stock => stock.gen.printName).join("\n- ")) : "`null\n`";
        const countStr = (stocks.length > 0) ? (stocks.map(stock => stock.qty.toString()).join("\n")) : "`  0  `";
        return ({
            title: "Roles",
            description: `*\`${this.gameId}\`*`,
            fields: [
                {
                    name: "Role",
                    value: rolesStr,
                    inline: true
                },
                {
                    name: "Count",
                    value: countStr,
                    inline: true
                }
            ]
        });
    }
}
