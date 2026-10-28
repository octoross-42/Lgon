import type { LgonContext } from "application/context/LgonContext.js";
import { MessageFlags, type Client, type Interaction, type User } from "discord.js";
import { ButtonId, SelectId } from "application/messaging/loadInteractions.js";
import { type InteractionCode, INTERACTION_CODES } from "application/errors/InteractionError.js";
import { LgonId, makeLgonId } from "types/LgonId.js";

import { runWithTrace } from 'infra/trace.js';
import { MessagingSource } from "application/ports/MessagingDirective.js";

type InteractionArgs =
{
	id: string,
	name: string,
	viewId: LgonId<"view">
};

function parseInteraction(str: string): InteractionArgs
{
	const splitted = str.split(":");
	return ({
		id: splitted[0],
		name: splitted[1],
		viewId: splitted.slice(2).join(":") as LgonId<"view">
	});
}

export async function onInteraction(lgon: LgonContext, bot: Client, interaction: Interaction, user: User): Promise<void>
{
	if (interaction.isMessageComponent())
	{
		const { id, name, viewId } = parseInteraction(interaction.customId);
		const discordId: LgonId<"adapter"> = makeLgonId("adapter", interaction.id);

		if ( !lgon.interactions.has(id) )
			return ;

		await interaction.deferReply( { flags: MessageFlags.Ephemeral } );
		console.log("interaction id : ", interaction.id);
		lgon.flowRunner.register("discord", discordId, interaction);
		const source: MessagingSource<"discord"> = {
			adapterId: discordId,
			adapter: "discord",
			kind: "interaction"
		};


		const userId: LgonId<"user"> = makeLgonId<"user">("user", interaction.user.id);
		let errorCode: InteractionCode = INTERACTION_CODES.OK;

		if (interaction.isButton())
			errorCode = await lgon.interactions.button(id as ButtonId, userId, viewId, source);

		else if (interaction.isStringSelectMenu())
			errorCode = await lgon.interactions.select(id as SelectId, name, userId, interaction.values, viewId as LgonId<"view">, source);
		
		if (errorCode === INTERACTION_CODES.OK)
			interaction.deleteReply();
		else
			lgon.flowRunner.run( {
				msg: {
					kind: "simple",
					script: {
						title: "\\:(",
						fields: [{ name: "", value: `Internal problem, please contact the dev\n\nCode: **${errorCode}**` }]}
					},
				intention: "error",
				source: source					
			});	// TODO : faire une gestion d'erreur plus générale, avec pe channel erreur ? jsp debrouille toi <3
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