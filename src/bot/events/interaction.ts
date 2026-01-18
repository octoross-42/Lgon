import type { ButtonInteraction, Client, Interaction, StringSelectMenuInteraction, User } from "discord.js";

async function changeGame(bot: Client, interaction: ButtonInteraction, argv: string[]): Promise<void>
{
	argv.shift();
	await bot.commands.get("change_game")?.run(bot, interaction.message, argv);
	interaction.deferUpdate();
	return ;
}

export async function onEvent(bot: Client, interaction: Interaction, user: User): Promise<void>
{
	if (interaction.isButton())
	{
		console.log(`Button clicked: ${interaction.customId}`);
		let argv = interaction.customId.split(" ");
		if (argv[0] === "change_game")
			return changeGame(bot, interaction as ButtonInteraction, argv);
		return ;
		// TODO change that add change game awaitingInteraction
	}
	else if (interaction.isStringSelectMenu())
	{
		// console.log("yay string menu: ", interaction);
		if (bot.awaitingInteractions.has(interaction.message.id))
			bot.awaitingInteractions.get(interaction.message.id).select(bot, interaction as StringSelectMenuInteraction, user);
		return ;
	}
	else if (interaction.isChatInputCommand())
	{
		console.log(interaction);
		const slashCommand = bot.slashCommands.get(interaction.commandName);
		// TODO checker si une commande du meme nom existe pour un autre bot (la commande doit venir pour notre (bot)
		if ( !slashCommand )
			return ;
	}
	// console.log(interaction);
}

export const name = "interactionCreate";