import { defaultLogLvl, logger, type LogLevel } from "../../../../infra/Logger.js";
import type { LgonId } from "../../../../types/LgonId.js";
import type { Game } from "../Game/Game.js";
import type { LgonContext } from "../../../../application/context/LgonContext.js";
import { UserPreferences } from "./UserPreferences.js";

export class LgonUser
{
	tellWarning: boolean; // TODO preferences
	historic: Set<LgonId<"archive">>; // TODO gamehistory
	game: Game | null;
	log_lvl: LogLevel; // TODO preferences
	preferences: UserPreferences;

	constructor(public readonly lgon: LgonContext, public readonly id: LgonId<"user">)
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

	joinGame(game: Game): void
	{
		if ( ( this.game && !this.game.players.canLeave(this) || !game.players.canJoin(this) ) )
			return ;
		
		this.game?.players.leave(this);
		game.players.join(this);
			
		this.game = game;
	}


	leaveGame(game: Game): void
	{
		if (game.meta.id !== this.game?.meta.id)
			return (logger.event( { code: "CANNOT_LEAVE", data: { reason: "not your game" } } ))

		if ( !game.players.canLeave(this) )
			return ;

		game.players.leave(this);
		this.game = null;
	}
}