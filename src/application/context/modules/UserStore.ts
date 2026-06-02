import { type LgonId, makeLgonId } from "types/LgonId.js";
import { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Logger } from "infra/Logger.js";

export class UserStore
{
	private readonly users: Map<LgonId<"user">, LgonUser>;
	private lgonUser: LgonUser;

	constructor(public readonly logger: Logger)
	{
		this.users = new Map<LgonId<"user">, LgonUser>();

		const lgonId: LgonId<"user"> = makeLgonId<"user">("user", "lgon");
		this.lgonUser = new LgonUser(lgonId, this.logger);
	}

	lgon(): Readonly<LgonUser>
	{
		return (this.lgonUser);
	}

	new(userId: LgonId<"user">): LgonUser | undefined
	{
		if ( this.users.has(userId) )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: "cannot create user: id already exists" }} );
			return (undefined);
		}
		const user = new LgonUser(userId, this.logger);
		this.users.set(userId, user);
		return (user);
	}

	get(userId: LgonId<"user">): LgonUser | undefined
	{
		return ( this.users.get(userId) );
	}

	

	joinGame()
	{}
}
