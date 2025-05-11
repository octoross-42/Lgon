import { EmbedBuilder } from "discord.js";
import { CONSTANTES } from "../../../config/constantes.js";
import { getPlayer } from "../../../classes/Game/Player.js";
export async function run(bot, message, argv) {
    let embed = new EmbedBuilder()
        .setColor('#158373');
    let player = getPlayer(bot, message.author, false);
    if (!player || (player.game === null)) {
        embed.addFields({ name: "**Error**", value: "You need to be activly in a game to show game info", inline: false });
        await message.reply({
            embeds: [embed],
            flags: CONSTANTES.FLAGS,
        });
        return;
    }
    embed.setTitle(`**Game ${player.game.name}**`);
    // embed.addFields( { name: '', value: '\u200B', inline: false });
    embed.setDescription("Config of the game");
    player.game.showPlayers(embed);
    player.game.showRoles(embed);
    await message.reply({
        embeds: [embed],
        flags: CONSTANTES.FLAGS,
    });
}
export const help = CONSTANTES.COMMANDS.GAME.DATA.SHOW;
