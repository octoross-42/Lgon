import { makeLgonId } from "../../../../types/LgonId.js";
export class LobbyControlsScriptMaker {
    userStore;
    constructor(userStore) {
        this.userStore = userStore;
    }
    script(authorId) {
        const gameId = this.userStore.get(authorId)?.game?.meta.id; // TODO
        return (new LobbyControlsScript(gameId ? gameId : makeLgonId("game", "null")));
    }
}
export class LobbyControlsScript {
    gameId;
    constructor(gameId) {
        this.gameId = gameId;
    }
    make() {
        return ({
            title: "Controls",
            description: `*\`${this.gameId}\`*`,
            fields: [
                {
                    name: "",
                    value: ""
                }
            ]
        });
    }
}
