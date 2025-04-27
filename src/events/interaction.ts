import { ButtonInteraction, Client, Interaction, MessageFlags } from "discord.js";
import { Player, getPlayer } from "../types/Player.js";
import { Game, getGame } from "../types/Game.js";

async function changeGame(bot: Client, interaction: ButtonInteraction, argv: string[]): Promise<void>
{
	argv.shift();
	await bot.commands.get("change_game")?.run(bot, interaction.message, argv);
	interaction.deferUpdate();
	return ;
}

export async function onEvent(bot: Client, interaction: Interaction): Promise<void>
{
	if (!interaction.isButton())
		return;

	console.log(`Button clicked: ${interaction.customId}`);
	let argv = interaction.customId.split(" ");
	if (argv[0] === "change_game")
		return changeGame(bot, interaction as ButtonInteraction, argv);
	
	// console.log(interaction);
}

export const name = "interactionCreate";