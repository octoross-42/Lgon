import { makeLgonId } from "../../../types/LgonId.js";
import { LgonUser } from "../../../core/game/entities/LgonUser/LgonUser.js";
export class UserStore {
    logger;
    users;
    lgonUser;
    constructor(logger) {
        this.logger = logger;
        this.users = new Map();
        const lgonId = makeLgonId("user", "lgon");
        this.lgonUser = new LgonUser(lgonId, "lgon", this.logger);
    }
    lgon() {
        return (this.lgonUser);
    }
    new(userId, name) {
        if (this.users.has(userId)) {
            this.logger.event({ code: "DESIGN_ERROR", data: { error: "cannot create user: id already exists" } });
            return (undefined);
        }
        const user = new LgonUser(userId, name, this.logger);
        this.users.set(userId, user);
        return (user);
    }
    get(userId) {
        return (this.users.get(userId));
    }
    joinGame() { }
}
