import { type Client } from "discord.js";
import type { LgonContext } from "application/context/LgonContext.js";

export function onEvent(lgon: LgonContext, bot: Client): void
{
	if (!bot.user)
		return;
	console.log("\nBot is in server:");
	for (const [name, guild] of bot.guilds.cache)
		console.log(`\t${guild.name}`);
	
	console.log(`\nBot ${bot.user!.tag} is online !\n`);
	bot.user!.setStatus("online");
	bot.user!.setActivity("P'tit Lg ?");
}

export const name = "clientReady";