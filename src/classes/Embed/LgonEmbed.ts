import { Client, User, EmbedBuilder, Message, MessageReaction } from "discord.js";

export abstract class LgonEmbed
{
	embed: EmbedBuilder;
	register: boolean;

	constructor()
	{
		this.embed = LgonEmbed.newEmbed();
		this.register = false;
	}
	
	public static newEmbed(): EmbedBuilder
	{
		let embed: EmbedBuilder = new EmbedBuilder()
			.setColor('#158373');
		return (embed);
	}

	public abstract send(bot: Client, message: Message): Promise<void>;
	public abstract interact(bot: Client, reaction: MessageReaction, user: User): Promise<void> | void;
};
