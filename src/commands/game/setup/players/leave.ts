import { CONSTANTES } from "../../../../config/constantes.js";
import { Player, getPlayer } from "../../../../classes/Game/Player.js";
import { Client, Message, EmbedBuilder } from "discord.js";

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	let embed = new EmbedBuilder()
		.setColor('#158373');
	// TODO laisser join pour un autre joueur (faire des authorisation de joueur a joueur pour modifier leurs parties), au moins les inviter
	
	let player: Player | null = getPlayer(bot, message.author, false);
	if ( !player )
		embed.addFields( { name: "**Error**", value: "You're not in any game", inline: false });
	else
		player.leaveGame(bot, embed );

	await message.reply(
	{
		embeds: [embed],
		flags: CONSTANTES.FLAGS,
	});
}

export const meta = 
{
	name : "leave",
	description : "Enlever un joueur",
	nbrArgsRequired : 0,
	cooldown: 1,
	where: "guild",
	aliases: ["unjoin"],
};