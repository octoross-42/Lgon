import { CONSTANTES } from "../../../../config/constantes.js";
import { Client, Message, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, APIEmbedField } from "discord.js";
import { Player, getPlayer } from "../../../../classes/Game/Player.js";

// TODO : gestion de vocal dans la nuit (exemple seuls les lgs peuvenet parler mais faut que ca soit invisible et inentandables par les autres)



export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{

	let embed = new EmbedBuilder()
		.setColor('#158373');
	// TODO laisser join pour un autre joueur (faire des authorisation de joueur a joueur pour modifier leurs parties), au moins les inviter
	
	let player: Player = getPlayer(bot, message.author)!;
	let embedComponents: ActionRowBuilder<ButtonBuilder>[] = [];
	let gameToJoinName: string | null = null;
	let askConfirmation: boolean = true;
	if (argv.length > 0)
	{
		if ((argv[0] === "-f") || (argv[0] === "--force"))
		{
			askConfirmation = false;
			if (argv.length > 1)
				gameToJoinName = argv[1];
		}
		else
		{
			gameToJoinName = argv[0];
			if ((argv.length > 1) && ((argv[1] === "-f") || (argv[1] === "--force")))
				askConfirmation = false;
		}
	}
	
	
	player.joinGame(bot, message.guild!, gameToJoinName, askConfirmation, embed, embedComponents);
	await message.reply(
	{
		embeds: [embed],
		components: embedComponents,
		flags: CONSTANTES.FLAGS,
	});
}

export const meta =
{
	name : "join",
	description : "Ajouter un joueur à une game",
	nbrArgsRequired : 0,
	cooldown: 1,
	where: "guild",
	usage: `- \`${CONSTANTES.PREFIX} join\` (si une game sur le serveur, la rejoint, sinon rejoint la game définie par défaut)\n- \`${CONSTANTES.PREFIX} join <game_name>\``,
};

// TODO : gerer waiting room en fonction de connexion vocale (a la fin de la partie, si des gens quittent le vocal, ca enleve la personne par defaut) -> en faire un paramètre modifiable