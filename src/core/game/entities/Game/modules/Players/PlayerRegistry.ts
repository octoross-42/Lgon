import type { Game } from "../../Game.js";
import { type LgonId, getLgonId } from "types/LgonId.js";
import { logger } from "infra/Logger.js";
import { Player } from "./Player.js";
import { LgonUser } from "../../../LgonUser/LgonUser.js";

export class PlayerRegistry
{
	private players: Map<LgonId<"user">, Player>;

	constructor(private readonly game: Game)
	{
		this.players = new Map();
	}

	canJoin(user: LgonUser): boolean
	{
		if ( this.players.has(user.id) )
			return (logger.event( { code: "ALREADY_JOINED", data: { userId: user.id, gameId: this.game.meta.id } } ), true);

		if (this.game.phase !== "setup")
			return (logger.event( { code: "CANNOT_JOIN", data: { userId: user.id, gameId: this.game.meta.id } } ), false);
		
		return (true);
	}

	canLeave(user: LgonUser): boolean
	{
		if ( this.game.phase !== "setup" )
			return (logger.event({ code : "CANNOT_LEAVE", data: { userId: user.id, gameId: this.game.meta.id } }), false);
		return (true);
	}

	join(user: LgonUser): void
	{
		this.players.set(user.id, new Player(user));
		return (logger.event( { code : "JOINED", data: { userId: user.id, gameId: this.game.meta.id } } ));
	}

	leave(user: LgonUser): void
	{
		this.players.delete(user.id);
		logger.event( { code: "LEFT", data: { userId: user.id, gameId: this.game.meta.id } } );

		user.game = null;

		if ( this.players.size === 0 )
			this.game.gameStore.delete(this.game.meta.id, "no more players");
	}
	
	getIds(): string[] { return (Array.from(this.players.keys(), key => getLgonId(key))); }

	size(): number { return (this.players.size); }

	ready(): boolean
	{
		this.players.forEach(player => {
			if (!player.ready)
				return (false);
		});
		return (true);
	}
}