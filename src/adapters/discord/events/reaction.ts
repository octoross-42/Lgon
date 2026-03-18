import type { Client, MessageReaction, User } from "discord.js";
// import { CONSTANTES } from "../config/constantes.js";

export function onEvent(bot: Client, reaction: MessageReaction, user: User): void
{
	if (user.bot)
		return;
	
	console.log("here");
	console.log("Reaction received : ", reaction.emoji.name, reaction.message.id);

	// let awaitingInteraction: AwaitingInteraction = bot.awaitingInteractions.get(reaction.message.id);
	// if (awaitingInteraction)
	// 	awaitingInteraction.react(bot, reaction, user);
	// console.log("Reaction received : ", reaction.emoji);

}

export const name = "messageReactionAdd";