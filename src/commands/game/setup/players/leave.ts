import { CONSTANTES } from "../../../../config/constantes.js";
import { Player } from "../../../../types/Player.js";
import { Client, Message } from "discord.js";

function getPlayer(bot: Client, message: Message): Player | null
{
	let player = bot.players.get(message.author.id);
	if ( !player )
		return (null);
	return ( player );
}

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	// console.log(message.author);
	// console.log(message.guild);
	// TODO mettre tout ca dans les class
	let player = getPlayer(bot, message);
	if ( !player )
	{
		(message.reply("You're not in any game"));
		return ;
	}
	if ( (player.inGame === null) && (player.waitingRoom === null) )
	{
		message.reply("You're not in any game");
		return ;
	}
	if ( player.inGame?.game.status !== "pending" )
	{
		message.reply("You can't leave a game that has already started");
		return ;
	}
	await message.reply(`You've left the game **${player.inGame.game.name}**`);
	player.leaveGame();

}

export const help = CONSTANTES.COMMANDS.GAME.SETUP.PLAYERS.LEAVE;