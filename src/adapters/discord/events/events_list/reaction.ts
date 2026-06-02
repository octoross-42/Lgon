import type { Client, MessageReaction, User } from "discord.js";
import type { LgonContext } from "application/context/LgonContext.js";

export function onEvent(lgon: LgonContext, bot: Client, reaction: MessageReaction, user: User): void
{
	if (user.bot)
		return;
	
	console.log("Reaction received : ", reaction.emoji.name, reaction.message.id);

	// let awaitingInteraction: AwaitingInteraction = bot.awaitingInteractions.get(reaction.message.id);
	// if (awaitingInteraction)
	// 	awaitingInteraction.react(bot, reaction, user);
	// console.log("Reaction received : ", reaction.emoji);

}

export const name = "messageReactionAdd";