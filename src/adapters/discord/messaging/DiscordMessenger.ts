import { MessagingPort, type MessagingTarget } from "application/ports/MessagingPort.js";
import { type Channel, type Client, EmbedBuilder, type SendableChannels, type Message, type User, MessageFlags, BaseMessageOptions } from "discord.js";
import type { View } from "application/messaging/model/View.js";
import { ComponentMaker } from "./ComponentMaker.js";
import { DiscordMessagingCache, MessageRef } from "../store/DiscordMessagingCache.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Logger } from "infra/Logger.js";
import { FlowContext, FlowData } from "application/messaging/model/Flow.js";

export class DiscordMessenger extends MessagingPort
{
	private readonly componentMaker: ComponentMaker;

	constructor(private readonly bot: Client,
				private readonly msgs: DiscordMessagingCache,
				private readonly logger: Logger)
	{
		super();
		this.componentMaker = new ComponentMaker(this.logger);
	}

	private async edit(msg: BaseMessageOptions, msgRef: MessageRef): Promise<void>
	{
		const channel: Channel | undefined = this.bot.channels.cache.get(msgRef.channelId);
		if ( !channel )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "discord channel", whatId: msgRef.channelId, ctx: "discord messenger edit" } } );
			return ;
		}

		if ( !channel?.isSendable() )
		{
			this.logger.event( { code: "NOT_SENDABLE", data: { channelId: msgRef.channelId } } );
			return ;
		}
		
		const msgDiscord: Message | undefined = channel.messages.cache.get(msgRef.msgId);

		if ( !msgDiscord )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "discord message", whatId: `msgId: ${msgRef.msgId}, channelId: ${msgRef.channelId}`, ctx: "discord messenger edit" } } );
			return ;
		}
		await msgDiscord.edit(msg);
	}

	private async guildSend(msg: BaseMessageOptions, channelId: string): Promise<MessageRef | undefined>
	{
		const channel: Channel | undefined = this.bot.channels.cache.get(channelId);
		if ( !channel )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "discord channel", whatId: channelId, ctx: "send:reply" } } );
			return ;
		}
		if (channel?.isSendable())
		{
			const sent = await (channel as SendableChannels).send(msg);
			return ({
				channelId: sent.channel.id,
				msgId: sent.id
			});
		}
		else
			this.logger.event( { code: "NOT_SENDABLE", data: { channelId: channelId } } );
	}
	

	private async reply(msg: BaseMessageOptions, msgTargetCtx: MessageRef): Promise<MessageRef | undefined>
	{
		const channel: Channel | undefined = this.bot.channels.cache.get(msgTargetCtx.channelId);
		if ( !channel )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "discord channel", whatId: msgTargetCtx.channelId, ctx: "send:reply" } } );
			return ;
		}

		if (channel?.isSendable())
		{
			const replyTo: Message | undefined = channel.messages.cache.get(msgTargetCtx.msgId);

			if ( !replyTo )
			{
				this.logger.event( { code: "SEND_CHANNEL_INSTEAD", data: { channelId: msgTargetCtx.channelId, msgId: msgTargetCtx.msgId } } );

				const sent = await (channel as SendableChannels).send(msg);
				return ({
					channelId: sent.channel.id,
					msgId: sent.id
				});
			}
			else
			{
				const sent = await replyTo.reply(msg);
				return ({
					channelId: sent.channel.id,
					msgId: sent.id
				});
			}
		}
		else
			this.logger.event( { code: "NOT_SENDABLE", data: { channelId: msgTargetCtx.channelId } } );
	}

	private async dmSend(msg: BaseMessageOptions, userId: string): Promise<MessageRef | undefined>
	{
		const user: User | undefined = this.bot.users.cache.get(userId);
		if ( !user )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "discord user", whatId: userId, ctx: "send:dm" } } );
			return ;
		}

		const sent = await user.send(msg);
		return {
			channelId: sent.channel.id,
			msgId: sent.id
		}
	}

	private makeMsgPayload<T extends FlowData>(view: View<T>, epheremal: boolean = false): BaseMessageOptions
	{
		let embed: EmbedBuilder = new EmbedBuilder();
	
		const msgScript = view.script(view.flowData);
		embed.setColor("#10695b");
		embed.setTitle(msgScript.title);
		if (msgScript.description)
			embed.setDescription(msgScript.description);
		// embed.setImage("rsc/werewolf.jpg"); // TODO
		
		
		embed.addFields(msgScript.fields);

		return ({
			embeds: [embed],
			allowedMentions: { repliedUser: false },
			// flags: (epheremal ? MessageFlags.Ephemeral as number: undefined), // TODO
			components: this.componentMaker.make( view.interactions, view.id, view.flowData )
		});
	}



	async send<T extends FlowData>(views: View<T>[], msgTarget: MessagingTarget, epheremal: boolean): Promise<void>
	{	
		for (const view of views)
		{
			const msg: BaseMessageOptions = this.makeMsgPayload(view, epheremal);
			
			let sent: MessageRef | undefined;
			switch (msgTarget.kind)
			{

				case "send":
				{
					sent = await this.guildSend( msg, msgTarget.channelId);
					break;
				}
				case "reply":
				{
					sent = await this.reply( msg, { msgId: msgTarget.msgId, channelId: msgTarget.channelId } );
					break;
				}
				case "dm":
				{
					sent = await this.dmSend( msg, msgTarget.userId );
					break;	
				}
				case "view":
				{
					const realMsgTarget: MessageRef | undefined = this.msgs.get(msgTarget.viewId);
					if ( !realMsgTarget )
					{
						this.logger.event( { code: "NOT_FOUND", data: { what: "message ref", whatId: msgTarget.viewId, ctx: "discord messenger send view" } } );
						return ;
					}
					sent = await this.reply( msg, realMsgTarget );
					break ;
				}
			}

			if ( !sent )
				return ;

			this.msgs.add( view.id, sent );
		}

		return ;
	}

	async update<T extends FlowData>(view: View<T>): Promise<void>
	{
		const viewRef: MessageRef | undefined = this.msgs.get(view.id);
		if ( !viewRef )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "view message ref", whatId: `${view.id}`, ctx: "discord messenger update" } } );
			return ;
		}
		this.edit(this.makeMsgPayload(view), viewRef);
	}

	async delete<T extends FlowData>(view: View<T>): Promise<void>
	{
		const viewRef: MessageRef | undefined = this.msgs.get(view.id);
		if ( !viewRef )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "view message ref", whatId: `${view.id}`, ctx: "discord messenger update" } } );
			return ;
		}

		const channel: Channel | undefined = this.bot.channels.cache.get(viewRef.channelId);
		if ( !channel )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "discord channel", whatId: viewRef.channelId, ctx: "send:reply" } } );
			return ;
		}

		if ( !channel?.isSendable() )
		{
			this.logger.event( { code: "NOT_SENDABLE", data: { channelId: viewRef.channelId } } );		
			return ;
		}
		
		const discordMsg: Message | undefined = channel.messages.cache.get(viewRef.msgId);

		if ( !discordMsg )
		{
			this.logger.event( { code: "NOT_FOUND", data: { what: "discord msg", msgId: `msgId: ${viewRef.msgId}, channelId: ${viewRef.channelId}` } } );
			return ;
		}
		
		await discordMsg.delete();
	}
};
