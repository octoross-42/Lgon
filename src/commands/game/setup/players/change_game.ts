import { CONSTANTES } from "../../../../config/constantes.js";
import { Player, getPlayer } from "../../../../classes/Game/Player.js";

import { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";

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

export const help = CONSTANTES.COMMANDS.GAME.SETUP.PLAYERS.CHANGE_GAME;