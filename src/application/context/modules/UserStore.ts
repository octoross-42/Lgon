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
		this.lgonUser = new LgonUser(lgonId, "lgon", this.logger);
	}

	lgon(): Readonly<LgonUser>
	{
		return (this.lgonUser);
	}

	new(userId: LgonId<"user">, name: string): LgonUser | undefined
	{
		if ( this.users.has(userId) )
		{
			this.logger.event( { code: "DESIGN_ERROR", data: { error: "cannot create user: id already exists" }} );
			return (undefined);
		}
		
		this.logger.event( { code: "CREATE", data: { whatId: userId } } );
		const user = new LgonUser(userId, name, this.logger);
		this.users.set(userId, user);
		return (user);
	}

	get(userId: LgonId<"user">): LgonUser | undefined
	{
		return ( this.users.get(userId) );
	}

	getOrCreate(userId: LgonId<"user">, name: string): LgonUser
	{
		if ( this.users.has(userId) )
			return ( this.users.get(userId)! );
		
		this.logger.event( { code: "CREATE", data: { whatId: userId } } );
		const user = new LgonUser(userId, name, this.logger);
		this.users.set(userId, user);
		return ( user );
	}

	joinGame()
	{}
}
