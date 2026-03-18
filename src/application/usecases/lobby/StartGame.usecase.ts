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

	private	getStartableUser(authorId: LgonId<"user">): LgonUser | null
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
			return (null);
		}
		return (user);
	}

	async run(authorId: LgonId<"user">): Promise<void>
	{
		const user: LgonUser | null = this.getStartableUser(authorId);
		if ( !user )
			return ;

		const newGame: Game = new Game(this.lgon, authorId);
		this.lgon.games.set(newGame.meta.id, newGame);
		user.joinGame(newGame);

	}
}
