import { Collection } from "discord.js";
export function onEvent(bot) {
    if (!bot.user)
        return;
    console.log("Bot is in server:");
    for (const [name, guild] of bot.guilds.cache) {
        console.log(`\t${guild.name}`);
        if (!bot.games.get(guild.id))
            bot.games.set(guild.id, new Collection());
    }
    console.log(`Bot ${bot.user.tag} is online !`);
    bot.user.setStatus("online");
    bot.user.setActivity("P'tit Lg ?");
}
export const name = "ready";
