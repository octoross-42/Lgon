import { DEFAULT_USER_STEPMODE } from "../../constants.js";
import { loadUsescases } from "../usecases/loadUsecases.js";
import { loadInteractions } from "../messaging/loadInteractions.js";
export class LgonContext {
    roles;
    gameStore;
    userStore;
    flowRunner;
    logger;
    usecases;
    interactions;
    // public readonly onPropertyUpdate: Map<LgonProperty, (prop: LgonProperty) => void>;
    constructor(roles, gameStore, userStore, flowRunner, logger) {
        this.roles = roles;
        this.gameStore = gameStore;
        this.userStore = userStore;
        this.flowRunner = flowRunner;
        this.logger = logger;
        this.usecases = loadUsescases(this.gameStore, this.userStore, this.flowRunner, this.logger);
        this.interactions = loadInteractions(flowRunner.viewStore, this.gameStore, this.userStore, this.flowRunner, this.logger);
        // this.onPropertyUpdate = new Map<LgonProperty, (prop: LgonProperty) => void>;
    }
    getStepMode(userId) {
        const user = this.userStore.get(userId);
        if (!user)
            return (DEFAULT_USER_STEPMODE);
        return (user.preferences.stepMode);
    }
}
