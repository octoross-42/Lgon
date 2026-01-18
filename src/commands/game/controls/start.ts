import { type Game, getGame } from "../../..//Game/Game.js";
import { CONSTANTES } from "../../../config/constantes.js";
import type { Client, Message } from "discord.js";
import { getPlayer, Player } from "../../../Player/Player.js";
import { StartEmbed } from "../../../Embed/StartEmbed.js";

// TODO envoyer tous les actions dispos en debut de nuit sauf les actions avec vision

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	let player: Player | null = getPlayer(bot, message.author);
	let startEmbed = new StartEmbed(player);
	await startEmbed.reply(bot, message);
}

export const meta =
{
	name : "start",
	description : "Commence la nuit manuellement",
	nbrArgsRequired : 0,
	cooldown: 1,
	where: "guild",
	
};