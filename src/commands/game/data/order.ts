import { Client, Message, EmbedBuilder } from "discord.js";
import { CONSTANTES } from "../../../config/constantes.js";
import { getRole, LgonRoleGenerator } from "../../../classes/LgonRole/LgonRoleGenerator.js";

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	let embed = new EmbedBuilder()
			.setColor('#158373');

	embed.setTitle(`**Order**`);

	let rolesString: string = "```ansi\n";
	for (const roleName of CONSTANTES.ROLES_ORDER)
	{
		// TODO faire un check si les roles existent dans roleOrder
		let role: LgonRoleGenerator | null = getRole(bot, roleName.toLowerCase());
		if (role !== null)
		{
			if (role.category === "Villageois")
				rolesString += `[0;36m`
			else if (role.category === "Loup")
				rolesString += `[0;31m`;
			else
				rolesString += `[0;37m`;

			// ■  □
			rolesString += `■ [0m` + roleName + "\n";
			
		}
	}
	rolesString += "```";


	embed.addFields(
		{name: '**Ordre des rôles**', value: "   " + rolesString, inline: false},
		{name: '\u200B', value: '', inline: false},
		{name: "**Doppleganger**", value: "Le doppleganger rejoue juste après tous les joueurs possédant le rôle copié"}
	);
	await message.reply(
		{
			embeds: [embed],
			flags: CONSTANTES.FLAGS,
		});
}


export const meta =
{
	name : "order",		
	description : "Affiche l'ordre des rôles dans la nuit",
	nbrArgsRequired : 0,
	cooldown: 1,
	where: "any",
}