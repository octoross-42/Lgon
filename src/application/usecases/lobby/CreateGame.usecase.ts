import type { LgonId } from "types/LgonId.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import { Game } from "core/game/entities/Game/Game.js";
import type { Flow, MessageScript } from "messagingFlows/model/Flow.js";
import { NotifierFlowMaker } from "messagingFlows/flows/NotifierFlowMaker.js";
import { LobbyFlow } from "messagingFlows/flows/Lobby/LobbyFlow.js";
import { Usecase, type UsecasesRegistry } from "application/entities/UsecasesRegistry.js";

function cannotCreateGameScript(contextId: string, userId: string): MessageScript
{
	return {
		title: "Error",
		fields: [{
			value: `<@${userId}> are already in game: ${contextId}, cannot leave and create another game`
		}]
	}
}

export class CreateGameUsecase extends Usecase
{
	constructor(registry: UsecasesRegistry)
	{
		super(registry);
	}

	private	createGame(user: LgonUser): Game
	{
		const newGame: Game = new Game(this.registry.lgon, user.id);
		this.registry.lgon.games.set(newGame.meta.id, newGame);
		user.joinGame(newGame); 
		
		return (newGame);
	}

	async run(authorId: LgonId<"user">): Promise<void>
	{
		let flow: Flow | null = null;
		let gameId: LgonId<"game"> | null = null;

		let user: LgonUser | undefined = this.registry.lgon.users.get(authorId);
		if ( !user )
		{
			user = new LgonUser(this.registry.lgon, authorId);
			this.registry.logger.event( { code: "CREATE_USER", data: { userId: user.id } } );
		}
		else if ( !user.canLeave() )
		{
			this.registry.logger.event( { code: "CANNOT_CREATE_GAME", data: { userId: user.id } } );

			if ( user.preferences.notifyError )
				flow = NotifierFlowMaker(cannotCreateGameScript);
		}
		else
		{
			const game: Game = this.createGame(user);
			gameId = game.meta.id;
			flow = LobbyFlow;
		}
		
		if ( !flow || !gameId )
			return ;
		
		// ADD TO STORE EVERYTHING AND SEND
		// await this.registry.messagingPort.send()
	}
}
