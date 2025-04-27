import { CONSTANTES } from "../../../../config/constantes.js";
import { Player, getPlayer } from "../../../../types/Player.js";
import { Game, getGame } from "../../../../types/Game.js";
import { Client, Message, MessageFlags } from "discord.js";

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	console.log("change_game");
}

export const help = CONSTANTES.COMMANDS.GAME.SETUP.PLAYERS.CHANGE_GAME;