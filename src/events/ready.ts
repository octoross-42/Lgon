import { Client, Collection } from "discord.js";
import { Game } from "../types/Game.js";

export function onEvent(bot: Client): void
{
	if (!bot.user)
		return;
	for (const [name, guild] of bot.guilds.cache)
	{
		// console.log(name, guild);
		// console.log(bot.games.get(guild.id));
		if ( !bot.games.get(guild.id) )
			bot.games.set(guild.id, new Collection<string, Game>());
	}
	console.log(`Bot ${bot.user!.tag} is online !`);
	bot.user!.setStatus("online");
    bot.user!.setActivity("P'tit Lg ? 😎");
}

export const name = "ready";