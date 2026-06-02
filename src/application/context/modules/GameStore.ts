import type { LgonId } from "types/LgonId.ts";
import { Game } from "core/game/entities/Game/Game.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { UserStore } from "./UserStore.js";
import type { Logger } from "infra/Logger.js";

import { CREATE_GAME_STATUS } from "application/usecases/STATUS.js";

export class GameStore
{
	private readonly games: Map<LgonId<"game">, Game>;

	constructor(private readonly users: UserStore,
				public readonly logger: Logger)
	{
		this.games = new Map<LgonId<"game">, Game>();
	}

	get(gameId: LgonId<"game">): Game | undefined
	{
		return ( this.games.get(gameId) );
	}

	new(user: LgonUser): CREATE_GAME_STATUS
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
				return ( status );
		}

		const newGame: Game = new Game(this);
		this.games.set(newGame.meta.id, newGame);
		newGame.join(user);
		user.game = newGame;
		
		return ( status );
	}

	delete(gameId: LgonId<"game">, reason: string)
	{

		// this.logger.event( { code: "DESTROY_GAME", data: { gameId: this.game.meta.id, reason:  } } );
	}
}
