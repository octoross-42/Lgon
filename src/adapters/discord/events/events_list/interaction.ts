import type { LgonContext } from "application/context/LgonContext.js";
import type { Client, Interaction, User } from "discord.js";
import { ButtonId, SelectId } from "application/messaging/loadInteractions.js";
import { LgonId, makeLgonId } from "types/LgonId.js";

import { runWithTrace } from 'infra/trace.js';

type InteractionArgs =
{
	id: string,
	name: string,
	viewId: string
};

function parseInteraction(str: string): InteractionArgs
{
	const splitted = str.split(":");
	return ({
		id: splitted[0],
		name: splitted[1],
		viewId: splitted.slice(2).join(":")
	});
}

export async function onInteraction(lgon: LgonContext, bot: Client, interaction: Interaction, user: User): Promise<void>
{
	if (interaction.isMessageComponent())
	{
		const { id, name, viewId } = parseInteraction(interaction.customId);
		
		if ( !lgon.interactions.has(id) )
			return ;

		interaction.deferUpdate();
		// interaction.deferReply( { ephemeral: true} );

		const userId: LgonId<"user"> = makeLgonId<"user">("user", interaction.user.id);

		if (interaction.isButton())
			lgon.interactions.button(id as ButtonId, userId, viewId);

		else if (interaction.isStringSelectMenu())
			lgon.interactions.select(id as SelectId, name, userId, interaction.values, viewId as LgonId<"view">);
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

export async function onEvent(lgon: LgonContext, bot: Client, interaction: Interaction, user: User): Promise<void>
{	
	await runWithTrace( async (): Promise<void> => onInteraction(lgon, bot, interaction, user) );
}

export const name = "interactionCreate";