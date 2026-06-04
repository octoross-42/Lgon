import type { LgonId, LgonIdKind } from "types/LgonId.ts";
import { Game } from "core/game/entities/Game/Game.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { UserStore } from "./UserStore.js";
import type { Logger } from "infra/Logger.js";

import { CREATE_GAME_STATUS } from "application/usecases/STATUS.js";
import type { LgonRoleGeneratorRegistry } from "./LgonRoleGeneratorRegistry.js";

export class GameStore
{
	private readonly games: Map<LgonId<"game">, Game>;

	constructor(public availableRoles: LgonRoleGeneratorRegistry,
				public readonly logger: Logger)
	{
		this.games = new Map<LgonId<"game">, Game>();
	}

	get(gameId: LgonId<"game">): Game | undefined
	{
		return ( this.games.get(gameId) );
	}

	new(user: LgonUser): { status: "SUCCESS", game: Game } | { status: Exclude<CREATE_GAME_STATUS, "SUCCESS"> }
	{
		let status: CREATE_GAME_STATUS = user.createGameStatus();
		if ( status != "SUCCESS" )
		{
			if ( (status === "SWITCH") && ( !user.preferences.confirm ) )
			{
				user.game!.players.leave(user);
				status = "SUCCESS";
			}
			else
				return ( { status: status } );
		}

		const newGame: Game = new Game(this.availableRoles, this.logger);
		this.games.set(newGame.meta.id, newGame);
		newGame.join(user);
		user.game = newGame;
		
		return ( { status: "SUCCESS", game: newGame } );
	}

	delete(gameId: LgonId<"game">, reason: string)
	{

		// this.logger.event( { code: "DESTROY_GAME", data: { gameId: this.game.meta.id, reason:  } } );
	}
}
