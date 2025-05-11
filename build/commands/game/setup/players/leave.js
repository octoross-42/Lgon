import { CONSTANTES } from "../../../../config/constantes.js";
import { getPlayer } from "../../../../classes/Game/Player.js";
import { EmbedBuilder } from "discord.js";
export async function run(bot, message, argv) {
    let embed = new EmbedBuilder()
        .setColor('#158373');
    // TODO laisser join pour un autre joueur (faire des authorisation de joueur a joueur pour modifier leurs parties), au moins les inviter
    let player = getPlayer(bot, message.author, false);
    if (!player)
        embed.addFields({ name: "**Error**", value: "You're not in any game", inline: false });
    else
        player.leaveGame(bot, embed);
    await message.reply({
        embeds: [embed],
        flags: CONSTANTES.FLAGS,
    });
}
export const help = CONSTANTES.COMMANDS.GAME.SETUP.PLAYERS.LEAVE;
