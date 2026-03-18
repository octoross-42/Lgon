import type { LgonContext } from "../../context/LgonContext.js";
import type { MessagingPort } from "../../ports/MessagingPort.js";
import type { LgonId } from "../../../types/LgonId.js";
import type { Logger } from "../../../infra/Logger.js";
import { LgonUser } from "../../../domain/game/entities/LgonUser/LgonUser.js";
import { Game } from "../../../domain/game/entities/Game/Game.js";

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
		let user: LgonUser | undefined = this.lgon.users.get(authorId);
		if ( !user )
		{
			user = new LgonUser(this.lgon, authorId);
			this.logger.event( { code: "CREATE_USER", data: { userId: user.id } } );
		}
		else if ( !user.canLeave() )
		{
			this.logger.event( { code: "CANNOT_CREATE_GAME", data: { userId: user.id } } );
			// this.messagingPort.send();
		}

		const game: Game = this.createGame(user);

	}
}
