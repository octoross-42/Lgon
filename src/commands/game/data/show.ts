import { Client, Message, EmbedBuilder } from "discord.js";
import { CONSTANTES } from "../../../config/constantes.js";
import { Player, getPlayer } from "../../../classes/Game/Player.js";

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	let embed = new EmbedBuilder()
			.setColor('#158373');
	
	let player: Player | null = getPlayer(bot, message.author, false);
	if ( !player || (player!.game === null) )
	{
		embed.addFields( { name: "**Error**", value: "You need to be activly in a game to show game info", inline: false });
		await message.reply(
		{
			embeds: [embed],
			flags: CONSTANTES.FLAGS,
		});
		return ;
	}

	embed.setTitle(`**Game ${player.game.meta.name}**`);
	// embed.addFields( { name: '', value: '\u200B', inline: false });
	embed.setDescription("Config of the game");
	player.game.showPlayers(embed);
	player.game.showRoles(embed);
	await message.reply(
		{
			embeds: [embed],
			flags: CONSTANTES.FLAGS,
		});
}


export const meta =
{
	name : "show",
	description : "Montre les parametres d'une game",
	nbrArgsRequired : 0,
	cooldown: 1,
	where: "any",
};