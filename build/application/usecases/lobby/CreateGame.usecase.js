import { LobbyFlow } from "../../messaging/flows/Lobby/LobbyFlow.js";
import { NotifyFlow } from "../../messaging/flows/Notify/NotifyFlow.js";
import { SwitchGameFlow } from "../../messaging/flows/Lobby/SwitchGameFlow.js";
import { InternalErrorScript } from "../../messaging/flows/Notify/scripts/internal_error.js";
import { CannotLeaveScript } from "../../messaging/flows/Notify/scripts/cannot_leave.js";
export class CreateGameUsecase {
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
    async run(authorId, originMsgTarget, authorName) {
        let gameId = null;
        let user = this.userStore.get(authorId);
        if (!user) {
            user = this.userStore.new(authorId, authorName);
            if (!user) {
                await this.flowRunner.run(NotifyFlow(InternalErrorScript), this.userStore.lgon(), originMsgTarget, undefined, true);
                return;
            }
            this.logger.event({ code: "CREATE", data: { whatId: user.id } });
        }
        const res = this.gameStore.new(user);
        switch (res.status) {
            case "SUCCESS":
                {
                    await this.flowRunner.run(LobbyFlow, user, originMsgTarget, { gameId: res.game.meta.id, gameStore: this.gameStore, logger: this.logger });
                    break;
                }
            case "CANNOT_LEAVE":
                {
                    await this.flowRunner.run(NotifyFlow(CannotLeaveScript), user, originMsgTarget, undefined, true);
                    break;
                }
            case "SWITCH":
                {
                    await this.flowRunner.run(SwitchGameFlow, user, originMsgTarget, { userId: user.id, userStore: this.userStore, gameStore: this.gameStore, logger: this.logger }, true);
                    break;
                }
        }
    }
}
