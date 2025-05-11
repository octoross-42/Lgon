import { Collection } from "discord.js";
export function onEvent(bot, guild) {
    console.log(`Joined server: ${guild.name}`);
    bot.games.set(guild.id, new Collection());
}
export const name = 'guildCreate';
