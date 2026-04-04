import type { LgonContext } from "../../context/LgonContext.js";
import type { MessagingPort } from "../../ports/MessagingPort.js";
import type { LgonId } from "../../../types/LgonId.js";
import type { Logger } from "../../../infra/Logger.js";
import { LgonUser } from "../../../domain/game/entities/LgonUser/LgonUser.js";
import { Game } from "../../../domain/game/entities/Game/Game.js";
import type { Flow, MessageScript } from "../../../messagingFlows/model/Flow.js";
import { NotifierMaker } from "../../../messagingFlows/flows/NotifierMaker.js";
import { LobbyFlow } from "src/messagingFlows/flows/Lobby/LobbyFlow.js";

function cannotCreateGameScript(contextId: string, userId: string): MessageScript
{
	return {
		title: "Error",
		fields: [{
			value: `<@${userId}> are already in game: ${contextId}, cannot leave and create another game`
		}]
	}
}

export class startGameUseCase
{
	constructor(
		private readonly lgon: LgonContext,
		private readonly messagingPort: MessagingPort,
		private readonly logger: Logger) {}

	private	createGame(user: LgonUser): Game
	{
		const newGame: Game = new Game(this.lgon, user.id);
		this.lgon.games.set(newGame.meta.id, newGame);
		user.joinGame(newGame); 
		
		return (newGame);
	}

	async run(authorId: LgonId<"user">): Promise<void>
	{
		let flow: Flow | null = null;
		let gameId: LgonId<"game"> | null = null;

		let user: LgonUser | undefined = this.lgon.users.get(authorId);
		if ( !user )
		{
			user = new LgonUser(this.lgon, authorId);
			this.logger.event( { code: "CREATE_USER", data: { userId: user.id } } );
		}
		else if ( !user.canLeave() )
		{
			this.logger.event( { code: "CANNOT_CREATE_GAME", data: { userId: user.id } } );

			if ( user.preferences.notifyError )
				flow = NotifierMaker(cannotCreateGameScript);
		}
		else
		{
			const game: Game = this.createGame(user);
			gameId = game.meta.id;
			flow = LobbyFlow;
		}
		
		if ( !flow || !gameId )
			return ;
		
		this.lgon.sequenceStore.add(gameId, authorId, flow);
		await this.messagingPort.send()
	}
}
