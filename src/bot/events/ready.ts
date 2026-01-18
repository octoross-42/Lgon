import { type Client, Collection } from "discord.js";
import type { Game } from "../../Game/Game.js";

export function onEvent(bot: Client): void
{
	if (!bot.user)
		return;
	console.log("Bot is in server:");
	for (const [name, guild] of bot.guilds.cache)
	{
		console.log(`\t${guild.name}`);
		if ( !bot.games.get(guild.id) )
			bot.games.set(guild.id, new Collection<string, Game>());
	}
	console.log(`Bot ${bot.user!.tag} is online !`);
	bot.user!.setStatus("online");
    bot.user!.setActivity("P'tit Lg ?");
}

export const name = "clientReady";