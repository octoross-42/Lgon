import { getLgonId } from "../../../../../../types/LgonId.js";
import { logger } from "../../../../../../infra/Logger.js";
import { Player } from "./Player.js";
export class PlayerRegistry {
    game;
    players;
    constructor(game) {
        this.game = game;
        this.players = new Map();
    }
    canJoin(user) {
        if (this.players.has(user.id))
            return (logger.event({ code: "ALREADY_JOINED", data: { userId: user.id, gameId: this.game.meta.id } }), true);
        if (this.game.phase !== "setup")
            return (logger.event({ code: "CANNOT_JOIN", data: { userId: user.id, gameId: this.game.meta.id } }), false);
        return (true);
    }
    canLeave(user) {
        if (this.game.phase !== "setup")
            return (logger.event({ code: "CANNOT_LEAVE", data: { userId: user.id, gameId: this.game.meta.id } }), false);
        return (true);
    }
    join(user) {
        this.players.set(user.id, new Player(user));
        return (logger.event({ code: "JOINED", data: { userId: user.id, gameId: this.game.meta.id } }));
    }
    leave(user) {
        this.players.delete(user.id);
        logger.event({ code: "LEFT", data: { userId: user.id, gameId: this.game.meta.id } });
        user.game = null;
        // if ( this.players.size === 0 )
        // 	this.game.gameStore.delete(this.game.meta.id, "no more players"); TODO see what we do
    }
    getIds() { return (Array.from(this.players.keys(), key => getLgonId(key))); }
    size() { return (this.players.size); }
    ready() {
        this.players.forEach(player => {
            if (!player.ready)
                return (false);
        });
        return (true);
    }
}
