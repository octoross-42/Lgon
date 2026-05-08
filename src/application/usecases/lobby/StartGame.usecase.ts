import type { LgonId } from "types/LgonId.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import { Game } from "core/game/entities/Game/Game.js";
import { Usecase, type UsecasesRegistry } from "application/entities/UsecasesRegistry.js";

export class StartGameUsecase extends Usecase
{
	constructor(registry: UsecasesRegistry)
	{
		super(registry);
	}

	private	getStartableUser(authorId: LgonId<"user">): LgonUser | null
	{
		let user: LgonUser | undefined = this.registry.lgon.users.get(authorId);
		if ( !user )
		{
			user = new LgonUser(this.registry.lgon, authorId);
			this.registry.logger.event( { code: "CREATE_USER", data: { userId: user.id } } );
		}
		else if ( !user.canLeave() )
		{
			this.registry.logger.event( { code: "CANNOT_CREATE_GAME", data: { userId: user.id } } );
			return (null);
		}
		return (user);
	}

	async run(authorId: LgonId<"user">): Promise<void>
	{
		const user: LgonUser | null = this.getStartableUser(authorId);
		if ( !user )
			return ;

		const newGame: Game = new Game(this.registry.lgon, authorId);
		this.registry.lgon.games.set(newGame.meta.id, newGame);
		user.joinGame(newGame);

	}
}
