import { Game, getGame } from "../../../classes/Game/Game.js";
import { CONSTANTES } from "../../../config/constantes.js";
import { Client, Embed, EmbedBuilder, Message } from "discord.js";
import { getPlayer, Player } from "../../../classes/Game/Player.js";
import { StartEmbed } from "../../../classes/Embed/StartEmbed.js";

// TODO envoyer tous les actions dispos en debut de nuit sauf les actions avec vision

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	let player: Player | null = getPlayer(bot, message.author);
	let startEmbed = new StartEmbed(player);
	await startEmbed.reply(bot, message);
}

export const help = CONSTANTES.COMMANDS.GAME.CONTROLS.START;