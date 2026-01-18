import { CONSTANTES } from "../../../../config/constantes.js";
import { type Player, getPlayer } from "../../../../Player/Player.js";

import { type Client, type Message, EmbedBuilder, type ActionRowBuilder, type ButtonBuilder } from "discord.js";

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{

	let embed = new EmbedBuilder()
			.setColor('#158373');
		// TODO laisser join pour un autre joueur (faire des authorisation de joueur a joueur pour modifier leurs parties), au moins les inviter
		
	let player: Player = getPlayer(bot, message.author)!;
		let embedComponents: ActionRowBuilder<ButtonBuilder>[] = [];
	if (argv.length > 0)
		player.joinGame(bot, message.guild!, argv[0], false, embed, embedComponents);
	else
		player.joinGame(bot, message.guild!, null, false, embed, embedComponents);
	
	await message.reply(
	{
		embeds: [embed],
		components: embedComponents,
		flags: CONSTANTES.FLAGS,
	});
		
}

export const meta =
{
	name : "change_game",
	description : "Ajouter un joueur à une game et force le joueur à change de game s'il est déjà dans une game",
	nbrArgsRequired : 0,
	cooldown: 1,
	aliases: ["change"],
	where: "guild",
	usage: `- \`${CONSTANTES.PREFIX} change_game\` (si une game sur le serveur, la rejoint, sinon rejoint la game définie par défaut)\n- \`${CONSTANTES.PREFIX} chnage_name <game_name>\``,
};