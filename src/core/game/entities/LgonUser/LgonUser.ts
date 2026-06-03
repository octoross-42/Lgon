import { defaultLogLvl, type Logger, type LogLevel } from "infra/Logger.js";
import type { LgonId } from "types/LgonId.js";
import type { Game } from "../Game/Game.js";
import { UserPreferences } from "./UserPreferences.js";
import { CREATE_GAME_STATUS } from "application/usecases/STATUS.js";

export class LgonUser
{
	tellWarning: boolean; // TODO preferences
	historic: Set<LgonId<"archive">>; // TODO gamehistory
	game: Game | null;
	log_lvl: LogLevel; // TODO preferences
	preferences: UserPreferences;

	constructor(public readonly id: LgonId<"user">,
				public name: string,
				public readonly logger: Logger)
	{
		this.tellWarning = true;
		this.historic = new Set<LgonId<"archive">>();
		this.game = null;
		this.log_lvl = defaultLogLvl;
		this.preferences = new UserPreferences();
	}

	canLeave(): boolean
	{
		if ( this.game )
			return (this.game.players.canLeave(this));
		return (true);
	}

	createGameStatus(): CREATE_GAME_STATUS
	{
		if ( !this.game )
			return ( "SUCCESS" );
		if ( this.game.players.canLeave(this) )
			return ( "SWITCH" );
		return ( "CANNOT_LEAVE" );
	}

	joinGame(game: Game): boolean
	{
		if ( ( this.game && !this.game.players.canLeave(this) || !game.players.canJoin(this) ) )
			return (false);
		
		this.game?.players.leave(this);
		game.players.join(this);
			
		this.game = game;
		return (true);
	}


	leaveGame(game: Game): void
	{
		if (game.meta.id !== this.game?.meta.id)
			return (this.logger.event( { code: "CANNOT_LEAVE", data: { reason: "not your game" } } ))

		if ( !game.players.canLeave(this) )
			return ;

		game.players.leave(this);
		this.game = null;	
	}

}