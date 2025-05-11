import { Client, Message, EmbedBuilder } from "discord.js";
import { CONSTANTES } from "../../../config/constantes.js";

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	let embed = new EmbedBuilder()
			.setColor('#158373');

	embed.setTitle(`**Rules**`);

	embed.addFields(
		{name: "**Setup**", value: `- Pour rejoindre une game, \`${CONSTANTES.PREFIX} join (<game>)\`\n- Pour ajouter des rôles, \`${CONSTANTES.PREFIX} add (<number>) <role>\`\nLa partie pourra commencer quand il y a 3 rôles de plus qu'il y a de joueurs et un minimum de ${CONSTANTES.MIN_NBR_PLAYERS} joueurs`, inline: false},
		{name: '\u200B', value: '', inline: false},
		{name: "**Nuit**", value: `Chaque joueur est attribué un role, et 3 roles sont distribués au centre (gauche milieu droite).\nPendant la nuit, les joueurs jouent dans l'ordre des rôles: \`${CONSTANTES.PREFIX} play\`, les joueurs peuvent jouer en avance, mais leur action ne sera comptée qu'à leur tour`, inline: false},
		{name: "**Jour**", value: `Une fois la nuit finie, chaque joueur se réveille pour discuter, leurs rôles ont changés à la suite des actions de la nuit, et ils engagent dans un débat pour déterminer qui sera éliminé`, inline: false},
		{name: "**Vote**", value: `Chaque joueur vote pour éliminer un joueur, le joueur avec le plus de votes est éliminé. S'il y a égalité en plusieurs joueurs, ceux-ci meurent tous. Une seule exception aux égalités: si tous les joueurs n'ont qu'un vote chacun, personne n'est éliminé`, inline: false},
		{name: '\u200B', value: '', inline: false},
		{name: "**Objectifs**", value: "3 types de rôles existent:\n- Les villageois, qui doivent éliminer au moins un loup-garou\n- Les loups-garous, qui ne doivent subir aucune perte de loups\n- Les indépendants, qui ont des objectifs bien propres à eux", inline: false},
		{name: '\u200B', value: '', inline: false},
		{name: "**Help**", value: `Pour plus d'infos sur les commandes, \`${CONSTANTES.PREFIX} help (<command>)\`\nPour plus d'infos sur un rôle, \`${CONSTANTES.PREFIX} <role>\`\nPour l'ordre des rôles, \`${CONSTANTES.PREFIX} order\``, inline: false},
	)
	await message.reply(
		{
			embeds: [embed],
			flags: CONSTANTES.FLAGS,
		});
}


export const help = CONSTANTES.COMMANDS.GAME.DATA.RULES;