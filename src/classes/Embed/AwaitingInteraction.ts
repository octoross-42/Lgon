import { EmbedBuilder, type Client, type MessageReaction, type User, type Message, type DMChannel, type TextChannel, type StringSelectMenuInteraction, type ButtonInteraction } from "discord.js";

export function newEmbed(): EmbedBuilder
{
	let embed: EmbedBuilder = new EmbedBuilder()
			.setColor('#158373');
	return (embed);
}

export abstract class AwaitingInteraction
{
	embed: EmbedBuilder;
	register: boolean;
	id: string;

	constructor()
	{
		this.id = "";
		this.embed = newEmbed();
		this.register = false;
	}
	
	public static newEmbed(): EmbedBuilder
	{
		let embed: EmbedBuilder = new EmbedBuilder()
			.setColor('#158373');
		return (embed);
	}

	public async reply(bot: Client, message: Message): Promise<void> {}
	public async send(bot: Client, channel: DMChannel | TextChannel): Promise<void> {}
	public async react(bot: Client, reaction: MessageReaction, user: User): Promise<void> {}
	public async select(bot: Client, selected: StringSelectMenuInteraction, user: User): Promise<void> {}
	public async button(bot: Client, pressed: ButtonInteraction, user: User): Promise<void> {}
};
