import type { LgonRoleMeta } from "discord.js";
import type { LgonRole } from "./LgonRole.js"
import type { Player } from "../Player/Player.js";

export class LgonRoleGenerator
{
	public readonly printName: string;
	declare public readonly name : string;
	declare public readonly category: "Loup" | "Villageois" | "Independant";
	declare public readonly description: string;
	declare public readonly cdv: string;
	declare public readonly usage: string;
	declare public readonly aliases: string[];
	declare public readonly action: boolean;
	declare public readonly information: boolean;
	declare public readonly vote: boolean;

	constructor(meta : LgonRoleMeta,
				private readonly roleClass: new (generator: LgonRoleGenerator,owner: Player | string, id: number) => LgonRole)
	{
		Object.assign(this, meta);
		this.printName = this.name[0].toUpperCase() + this.name.slice(1);
	}
	generateRole(owner: Player | string, id: number): LgonRole { return new this.roleClass(this, owner , id); }
}
