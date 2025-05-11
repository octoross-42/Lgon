import type { LgonRoleHelp, Client } from "discord.js";
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
	name: string;
	printName: string;
	description: string;
	aliases: string[];
	category: "Loup" | "Villageois" | "Independant";
	cdv: string;
	usage: string;
	action: boolean;
	information: boolean;
	vote: boolean;
	roleGenerator: <R extends LgonRole>(help : LgonRoleHelp, printName: string, owner: Player | string, id: number) => R;

	constructor(help : LgonRoleHelp, roleGenerator: <R extends LgonRole>(help : LgonRoleHelp, printName: string, owner: Player | string, id: number) => R)
	{
		this.name = help.name;
		this.printName = this.name[0].toUpperCase() + this.name.substring(1);
		this.description = help.description;
		this.usage = help.usage;
		this.aliases = help.aliases || [];
		this.cdv = help.cdv;
		this.action = help.action;
		this.information = help.information;
		this.vote = help.vote;

		this.category = help.category;
		this.roleGenerator = roleGenerator;
		console.log(this.category);
		
	}

	generateRole<R extends LgonRole>(owner: Player | string, id: number): R
	{
		let help: LgonRoleHelp = {
			name: this.name,
			category: this.category,
			description: this.description,
			cdv: this.cdv,
			usage: this.usage,
			action: this.action,
			information: this.information,
			vote: this.vote
		};
		return (this.roleGenerator(help, this.printName, owner, id));
	}
}
