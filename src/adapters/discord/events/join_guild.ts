import { type Guild, type Client } from "discord.js";

export function onEvent(bot: Client, guild: Guild): void
{
	console.log(`Joined server: ${guild.name}`);
}

export const name = 'guildCreate'