import { CONSTANTES } from "../../../../config/constantes.js";
import { Client, Message } from "discord.js";

export function run(bot: Client, message: Message, argv: string[]): Promise<void> | void
{
	// console.log(message.author);
	// console.log(message.guild);
}

export const meta =
{
	name : "spectate",
	description : "Spectate une game",
	nbrArgsRequired : 0,
	cooldown: 1,
	where: "guild",
};