import { defaultLogLvl } from "../../../../infra/LOG_EVENTS.js";
import { UserPreferences } from "./UserPreferences.js";
export class LgonUser {
    id;
    name;
    logger;
    tellWarning; // TODO preferences
    historic; // TODO gamehistory
    game;
    log_lvl; // TODO preferences
    preferences;
    constructor(id, name, logger) {
        this.id = id;
        this.name = name;
        this.logger = logger;
        this.tellWarning = true;
        this.historic = new Set();
        this.game = null;
        this.log_lvl = defaultLogLvl;
        this.preferences = new UserPreferences();
    }
    canLeave() {
        if (this.game)
            return (this.game.players.canLeave(this));
        return (true);
    }
    createGameStatus() {
        if (!this.game)
            return ("SUCCESS");
        if (this.game.players.canLeave(this))
            return ("SWITCH");
        return ("CANNOT_LEAVE");
    }
    joinGame(game) {
        if ((this.game && !this.game.players.canLeave(this) || !game.players.canJoin(this)))
            return (false);
        this.game?.players.leave(this);
        game.players.join(this);
        this.game = game;
        return (true);
    }
    leaveGame(game) {
        if (game.meta.id !== this.game?.meta.id)
            return (this.logger.event({ code: "CANNOT_LEAVE", data: { reason: "not your game" } }));
        if (!game.players.canLeave(this))
            return;
        game.players.leave(this);
        this.game = null;
    }
}
