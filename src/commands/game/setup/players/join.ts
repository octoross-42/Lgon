import { CONSTANTES } from "../../../../config/constantes.js";
import { Client, Message, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, APIEmbedField } from "discord.js";
import { Player, getPlayer } from "../../../../types/Player.js";
import { Game, getGame } from "../../../../types/Game.js";


// TODO : gestion de vocal dans la nuit (exemple seuls les lgs peuvenet parler mais faut que ca soit invisible et inentandables par les autres)



export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{

	let embed = new EmbedBuilder()
		.setColor('#158373');
	// TODO laisser join pour un autre joueur (faire des authorisation de joueur a joueur pour modifier leurs parties), au moins les inviter
	
	let player: Player = getPlayer(bot, message.author)!;
	let embedComponents: ActionRowBuilder<ButtonBuilder>[] = [];
	if (argv.length > 0)
		player.joinGame(bot, message.guild!, argv[0], true, embed, embedComponents);
	else
		player.joinGame(bot, message.guild!, null, true, embed, embedComponents);
	
	await message.reply(
	{
		embeds: [embed],
		components: embedComponents,
		flags: CONSTANTES.FLAGS,
	});
}

export const help = CONSTANTES.COMMANDS.GAME.SETUP.PLAYERS.JOIN;

// TODO : gerer waiting room en fonction de connexion vocale (a la fin de la partie, si des gens quittent le vocal, ca enleve la personne par defaut) -> en faire un paramètre modifiable