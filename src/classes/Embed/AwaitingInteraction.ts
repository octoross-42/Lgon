import { Client, MessageReaction, User } from "discord.js";
import { LgonEmbed } from "./LgonEmbed";

export enum AwaitingInteractionType 
{
	START,
	ADD,
	RM,
	PLAY,
	PREPLAY,
	// STOP,
	// PAUSE,
	// RESUME,
	// DELETE,
	// RESTART,
	// END
}

export class AwaitingInteraction
{
	type: AwaitingInteractionType;
	id: string;
	embed: LgonEmbed;

	constructor(type: AwaitingInteractionType, id: string, embed: LgonEmbed)
	{
		this.type = type;
		this.id = id;
		this.embed = embed;
	}

	
	interact(bot: Client, reaction: MessageReaction, user: User)
	{
		this.embed.interact(bot, reaction, user);
	}
}