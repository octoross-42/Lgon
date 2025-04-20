import { Client } from "discord.js";

export function onEvent(bot: Client): void
{
	if (!bot.user)
		return;
	console.log(`Bot ${bot.user!.tag} is online !`);
	bot.user!.setStatus("online");
    bot.user!.setActivity("P'tit Lg ? 😎");
}

export const name = "ready";