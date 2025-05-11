import { EmbedBuilder } from "discord.js";
import { CONSTANTES } from "../../../config/constantes.js";
import { getRole } from "../../../classes/LgonRole/LgonRoleGenerator.js";
export async function run(bot, message, argv) {
    let embed = new EmbedBuilder()
        .setColor('#158373');
    embed.setTitle(`**Order**`);
    let rolesString = "```ansi\n";
    for (const roleName of CONSTANTES.ROLES_ORDER) {
        let role = getRole(bot, roleName.toLowerCase());
        if (role !== null) {
            if (role.category === "villageois")
                rolesString += `[0;36m`;
            else if (role.category === "loup")
                rolesString += `[0;31m`;
            else
                rolesString += `[0;37m`;
            // ■  □
            rolesString += `■ [0m` + roleName + "\n";
        }
    }
    rolesString += "```";
    embed.addFields({ name: '**Ordre des rôles**', value: "   " + rolesString, inline: false }, { name: '\u200B', value: '', inline: false }, { name: "**Doppleganger**", value: "Le doppleganger rejoue juste après tous les joueurs possédant le rôle copié" });
    await message.reply({
        embeds: [embed],
        flags: CONSTANTES.FLAGS,
    });
}
export const help = CONSTANTES.COMMANDS.GAME.DATA.ORDER;
