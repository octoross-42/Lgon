import { ButtonInteraction, Client, Interaction, MessageFlags } from "discord.js";
import { Player, getPlayer } from "../classes/Game/Player.js";
import { Game, getGame } from "../classes/Game/Game.js";

async function changeGame(bot: Client, interaction: ButtonInteraction, argv: string[]): Promise<void>
{
	argv.shift();
	await bot.commands.get("change_game")?.run(bot, interaction.message, argv);
	interaction.deferUpdate();
	return ;
}

export async function onEvent(bot: Client, interaction: Interaction): Promise<void>
{
	if (interaction.isButton())
	{
		console.log(`Button clicked: ${interaction.customId}`);
		let argv = interaction.customId.split(" ");
		if (argv[0] === "change_game")
			return changeGame(bot, interaction as ButtonInteraction, argv);
		return ;
	}
	else if (!interaction.isChatInputCommand())
		return ;
	console.log(interaction);
	const slashCommand = bot.slashCommands.get(interaction.commandName);
	// TODO checker si une commande du meme nom existe pour un autre bot (la commande doit venir pour notre (bot)
	if ( !slashCommand )
		return ;
	
	// console.log(interaction);
}

export const name = "interactionCreate";