import type { RoleHelp } from "discord.js";
import { Player } from "./Player.js";

export class LgonRole
{
	name: string;
	description: string;
	aliases: string[];
	category: string[];
	cdv: string;
	usage: string;
	action: boolean;
	information: boolean;
	vote: boolean;
	player: Player | null;

	// run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;

	constructor(help : RoleHelp, roleFilePath: string)
	{
		this.name = help.name;
		this.description = help.description;
		this.usage = help.usage;
		this.aliases = help.aliases || [];
		this.cdv = help.cdv;
		this.action = help.action;
		this.information = help.information;
		this.vote = help.vote;

		const path = roleFilePath.split("/");
		const initPath = path.indexOf("roles");
		this.category = path.slice(initPath + 1, -1);
		// console.log(this.category);
		this.player = null;
		// this.run = run;
	}
	setPlayer(player: Player)
	{
		this.player = player;
	}

	getMainCategory(): string
	{
		if (this.category.length > 0)
			return (this.category[0]);
		return ("");
	}
}
