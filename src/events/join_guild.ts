import { Guild, Collection, Client } from "discord.js";
import { Game } from "../classes/Game/Game.js";

export function onEvent(bot: Client, guild: Guild): void
{
	console.log(`Joined server: ${guild.name}`);
	bot.games.set(guild.id, new Collection<string, Game>());
}

export const name = 'guildCreate'