import { MessagingPort } from "application/ports/MessagingPort.js";
import { type Client, EmbedBuilder, Message, type User, BaseMessageOptions, type ChatInputCommandInteraction, type MessageContextMenuCommandInteraction, type UserContextMenuCommandInteraction, type PrimaryEntryPointCommandInteraction, type AnySelectMenuInteraction, type ButtonInteraction, type ModalSubmitInteraction, InteractionReplyOptions, Channel, SendableChannels, InteractionResponse } from "discord.js";
import type { Script, View } from "application/messaging/model/View.js";
import { ComponentMaker } from "./ComponentMaker.js";
import type { DiscordMessagingCache } from "../store/DiscordMessagingCache.js";
import type { Logger } from "infra/Logger.js";
import type { DataFlow } from "application/messaging/model/Flow.js";
import type { MessageDirective, MessagingDirective, MessagingTarget } from "application/ports/MessagingDirective.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";

type DiscordRepliable = ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction | AnySelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction | Message;
type DiscordEditable = InteractionResponse | Message;
type DiscordDeletable = InteractionResponse | Message;
type DiscordEditRepliable = ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction | AnySelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction;

export type DiscordResource = InteractionResponse| SendableChannels | User | DiscordRepliable;
export type MessagingOptions = Pick<BaseMessageOptions & InteractionReplyOptions, "components" | "allowedMentions" | "embeds">;

export class DiscordMessenger extends MessagingPort
{
	private readonly componentMaker: ComponentMaker;

	constructor(private readonly bot: Client,
		private readonly cache: DiscordMessagingCache,
		private readonly logger: Logger)
	{
		super("discord");
		this.componentMaker = new ComponentMaker(this.logger);
	}
	
	public register(id: LgonId<"adapter">, rsc: DiscordResource)
	{
		this.cache.add(id, rsc);
		// TODO doublon etc
	}

	private makeDiscordEmbed(script: Script): EmbedBuilder
	{
		let embed: EmbedBuilder = new EmbedBuilder();
		
		embed.setColor("#10695b");
		embed.setTitle(script.title);
		if (script.description)
			embed.setDescription(script.description);
		// embed.setImage("rsc/werewolf.jpg"); // TODO
		
		embed.addFields(script.fields);
		
		return (embed);
	}


	private makeMsgPayload<T extends DataFlow>(view: View<T>): MessagingOptions
	{
		let embed: EmbedBuilder = this.makeDiscordEmbed(view.script(view.flowData));
	
		return ({
			embeds: [embed],
			allowedMentions: { repliedUser: false },
			components: this.componentMaker.make( view.interactions, view.id, view.flowData )
		});
	}


	// private async dmSend(msg: MessagingOptions, userId: string): Promise<void | undefined>
	// {
	// 	const user: User | undefined = this.bot.users.cache.get(userId);
	// 	if ( !user )
	// 	{
	// 		this.logger.event( { code: "NOT_FOUND", data: { what: "discord user", whatId: userId, ctx: "send:dm" } } );
	// 		return ;
	// 	}

	// 	const sent = await user.send(msg);
	// 	return {
	// 		channelId: sent.channel.id,
	// 		msgId: sent.id
	// 	}
	// }

	private async send(channel: SendableChannels, msgOptions: MessagingOptions): Promise<void>
	{
		const msg: Message = await channel.send(msgOptions);
		this.cache.add(makeLgonId("adapter", msg.id), msg);
	}

	private async reply(origin: DiscordRepliable, msgOptions: MessagingOptions): Promise<void>
	{
		if (origin instanceof Message)
		{
			const msg: Message = await origin.reply(msgOptions);
			this.cache.add(makeLgonId("adapter", msg.id), msg);
		}
		else
		{
			const msg: InteractionResponse = await origin.reply(msgOptions);
			this.cache.add(makeLgonId("adapter", msg.id), msg);
		}

	}

	private async editReply(origin: DiscordEditRepliable, msgOptions: MessagingOptions): Promise<void>
	{
		await origin.editReply(msgOptions);
	}

	private async delete(what: DiscordDeletable, id: LgonId<"adapter">): Promise<void>
	{
		this.cache.rm(id);
		await what.delete();
	}


	private	cannotTarget(target: MessagingTarget): boolean
	{
		if (target.originAdapter === "discord" )
			return (true);

		switch (target.kind)
		{
			case ("delete"):
				return (false);
			case ("dm"):
				return (false);
			case ("edit-reply"):
				return (false);
			case ("update"):
				return (false);
			case ("reply"):
				return (true);
			default:
				return (false);
		}
	}

	public async execute(views: View<DataFlow>[], target: MessagingTarget): Promise<void>
	{
		const rsc: DiscordResource | undefined = this.cache.get(target.targetId);
		if ( !rsc )
		{
			this.logger.event( { code: "TARGET_NOT_FOUND", data: { id: target.targetId, adapter: "discord" } } );
			return ;
		}
		if (this.cannotTarget(target))
		{
			this.logger.event( { code: "IMPOSSIBLE_TARGET", data: target } );
			return ;
		}

		let i: number = 0;
		let msgingOptions: MessagingOptions;

		i = (target.kind in ["edit-reply", "update", "delete"] ? (views.length - 1): 0);
		while (i < views.length)
		{
			
			msgingOptions = this.makeMsgPayload(views[i ++]);
			switch (target.kind)
			{
				case ("reply"):
				{
					if (target.originAdapter === "discord")
					{
						if ("reply" in rsc)
							await this.reply(rsc, msgingOptions);
						else
						{
							this.logger.event({ code: "WRONG_TARGET", data: { ...target, missingMethod: "reply" } });
							return ;
						}
					}
					// else TODO jsp quoi faire, mettre en place un systeme de distribution multi adapter
					// 	return (await this.send(target.targetId, msgingOptions))
				}
				case ("edit-reply"):
				{
					if ("editReply" in rsc)
						await this.editReply(rsc, msgingOptions);
					else
					{
						this.logger.event({ code: "WRONG_TARGET", data: { ...target, missingMethod: "editReply" } });
						return ;
					}
				}
				
			}
			// i ++;
		}
	}

};
