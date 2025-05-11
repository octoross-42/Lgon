import { EmbedBuilder } from "discord.js";
import { CONSTANTES } from "../../../config/constantes.js";
async function statusAllGames(bot, message) {
    let embed = new EmbedBuilder()
        .setColor('#158373')
        .setTitle(`**Games on ${message.guild.name}**`)
        .setDescription("Here are the games you can join :")
        .setFooter({ text: "You can use `!join <game_name>` to join a game." });
    await message.reply({ embeds: [embed], flags: CONSTANTES.FLAGS });
}
async function statusGame(bot, message, game) {
}
export async function run(bot, message, argv) {
    let player = bot.players.get(message.author.id);
    if (!player && message.guild)
        return (statusAllGames(bot, message));
    // else if (  )
    // {
    // 	let status_command = bot.commands.get("status");
    // 	if ( status_command )
    // 		help_command(message, status_command);
    // 	return ;
    // }
    // if ( player.game || player.waitingRoom )
    // 	return (statusGame(bot, message, player.game || player.waitingRoom!));
    // if ( message.guild )
    // 	return (statusAllGames(bot, message));
    // let status_command = bot.commands.get("status");
    // 	if ( status_command )
    // 		help_command(message, status_command);
    // 	return ;
}
export const help = CONSTANTES.COMMANDS.GAME.DATA.STATUS;
