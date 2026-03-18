import type { CommandMeta } from "./CommandMeta.js";
import type { Client, Message } from "discord.js";

export class Command
{
	constructor(
		public readonly meta : CommandMeta, 
		public readonly run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void){}

	getMainCategory(): string
	{
	  if (this.meta.category.length > 0)
		return (this.meta.category[0]);
	  return ("");
	}
}
