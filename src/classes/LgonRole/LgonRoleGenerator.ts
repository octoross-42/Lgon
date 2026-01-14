import type { LgonRoleMeta, Client } from "discord.js";
import { LgonRole } from "./LgonRole.js"
import { Player } from "../Game/Player.js";

export function getRoleName(bot: Client, roleName : string) : string | null
{
	if (bot.roles.has(roleName))
		return (roleName);
	let role: LgonRoleGenerator | undefined = bot.roles.find(roleFile => roleFile.aliases?.includes(roleName));
	if ( !role )
		return (null);
	return (role.name);
}

export function getRole(bot: Client, roleName: string): LgonRoleGenerator | null
{
	let role: LgonRoleGenerator | undefined = bot.roles.get(roleName)
			|| bot.roles.find(roleFile => roleFile.aliases?.includes(roleName));
	if ( !role )
		return (null);
	return (role);
}

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
