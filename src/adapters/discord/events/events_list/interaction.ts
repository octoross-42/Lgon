import type { LgonContext } from "application/context/LgonContext.js";
import type { Client, Interaction, User } from "discord.js";
import { ButtonName, SelectName } from "messagingFlows/loadInteractions.js";
import { LgonId, makeLgonId } from "types/LgonId.js";


type InteractionArgs =
{
	interactionName: string,
	args: string
};

function parseInteraction(str: string): InteractionArgs
{
	const splitted = str.split(":");
	return ({
		interactionName: splitted[0],
		args: splitted.slice(1).join(":")
	});
}

export async function onEvent(lgon: LgonContext, bot: Client, interaction: Interaction, user: User): Promise<void>
{
	
	if (interaction.isMessageComponent())
	{
		const { interactionName, args } = parseInteraction(interaction.customId);

		if ( !lgon.interactions.has(interactionName) )
			return ;

		interaction.deferUpdate();

		const userId: LgonId<"user"> = makeLgonId<"user">("user", interaction.user.id);

		if (interaction.isButton())
			lgon.interactions.button(interactionName as ButtonName, userId, args);

		else if (interaction.isStringSelectMenu())
		{
			console.log(interaction.values);
			lgon.interactions.select(interactionName as SelectName, userId, args, interaction.values);
		}
	}
	
	else if (interaction.isChatInputCommand())
	{
		// console.log(interaction);
		// const slashCommand = bot.slashCommands.get(interaction.commandName);
		// // TODO checker si une commande du meme nom existe pour un autre bot (la commande doit venir pour notre (bot)
		// if ( !slashCommand )
		// 	return ;
	}
	// console.log(interaction);
}

export const name = "interactionCreate";