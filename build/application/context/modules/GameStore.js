import { Game } from "../../../core/game/entities/Game/Game.js";
export class GameStore {
    availableRoles;
    logger;
    games;
    constructor(availableRoles, logger) {
        this.availableRoles = availableRoles;
        this.logger = logger;
        this.games = new Map();
    }
    get(gameId) {
        return (this.games.get(gameId));
    }
    new(user) {
        let status = user.createGameStatus();
        if (status != "SUCCESS") {
            if ((status === "SWITCH") && (!user.preferences.confirm)) {
                user.game.players.leave(user);
                status = "SUCCESS";
            }
            else
                return ({ status: status });
        }
        const newGame = new Game(this.availableRoles, this.logger);
        this.games.set(newGame.meta.id, newGame);
        newGame.join(user);
        user.game = newGame;
        return ({ status: "SUCCESS", game: newGame });
    }
    delete(gameId, reason) {
        // this.logger.event( { code: "DESTROY_GAME", data: { gameId: this.game.meta.id, reason:  } } );
    }
}
