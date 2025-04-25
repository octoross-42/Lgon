import { Client, Message, CommandHelp } from "discord.js";
import { CONSTANTES } from "../config/constantes.js";

export class BotCommand
{
	name: string;
	description: string;
	usage: string;
	defaultUsage: boolean;
	aliases: string[];
	cooldown: number;
	nbrArgsRequired: number;
	category: string[];
	where: "dm" | "guild" | "any";
	run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;

	constructor(help : CommandHelp, commandFilePath: string, run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void)
	{
	  this.name = help.name;
	  this.description = help.description;
	  this.defaultUsage = true;
	  this.where = help.where;
	  this.usage = `\`${CONSTANTES.PREFIX} ${help.name}\``;
	  if (help.usage)
	  {
		this.usage = help.usage;
		this.defaultUsage = false;
	  }
	  this.aliases = help.aliases || [];
	  this.cooldown = help.cooldown;
	  this.nbrArgsRequired = help.nbrArgsRequired;

	  const path = commandFilePath.split("/");
	  const initPath = path.indexOf("commands");
	  this.category = path.slice(initPath + 1, -1);
	//   console.log(this.category);
	  this.run = run;
	}

	getMainCategory(): string
	{
	  if (this.category.length > 0)
		return (this.category[0]);
	  return ("");
	}
}
