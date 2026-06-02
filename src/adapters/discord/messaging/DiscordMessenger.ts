import { MessagingPort, type MessagingTarget } from "application/ports/MessagingPort.js";
import { type Channel, type Client, EmbedBuilder, type Guild, type SendableChannels, type MessageCreateOptions, type Message, type User, MessageFlags } from "discord.js";
import type { MessageView } from "messagingFlows/model/View.js";
import { ComponentMaker } from "./ComponentMaker.js";
import { DiscordMessagingCache, MsgTargetCtx } from "../store/DiscordMessagingCache.js";
import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { Logger } from "infra/Logger.js";

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

	private async guildSend(msg: MessageCreateOptions, channelId: string): Promise<MsgTargetCtx | undefined>
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
	

	private async reply(msg: MessageCreateOptions, msgTargetCtx: MsgTargetCtx): Promise<MsgTargetCtx | undefined>
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

	private async dmSend(msg: MessageCreateOptions, userId: string): Promise<MsgTargetCtx | undefined>
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

	private makeMsgPayload(view: MessageView, author: LgonUser, epheremal: boolean): MessageCreateOptions
	{
		let embed: EmbedBuilder = new EmbedBuilder();
	
		const msgScript = view.script.make();
		embed.setColor("#10695b");
		embed.setTitle(msgScript.title);
		if (msgScript.description)
			embed.setDescription(msgScript.description);
		// embed.setImage("rsc/werewolf.jpg"); // TODO
		
		
		embed.addFields(msgScript.fields);

		return ({
			embeds: [embed],
			allowedMentions: { repliedUser: false },
			flags: (epheremal ? MessageFlags.Ephemeral as number: undefined) ,
			components: this.componentMaker.make( view.interactions, author )
		});
	}

	async send(views: MessageView[], author: LgonUser, msgTarget: MessagingTarget, epheremal: boolean): Promise<void>
	{	
		for (const view of views)
		{
			const msg: MessageCreateOptions = this.makeMsgPayload(view, author, epheremal);
			
			let sent: MsgTargetCtx | undefined;
			switch (msgTarget.kind)
			{

				case "send":
				{
					const channelId: string | undefined = this.msgs.getChannel(msgTarget.viewId);
					if ( !channelId )
					{
						this.logger.event( { code: "NOT_FOUND", data: { what: "channel", whatId: msgTarget.viewId, ctx: "send:send" } } );
						return ;
					}

					sent = await this.guildSend( msg, channelId);
					break;
				}
				case "reply":
				{	
					const msgTargetCtx: MsgTargetCtx | undefined = this.msgs.get(msgTarget.viewId);
					if ( !msgTargetCtx )
					{
						this.logger.event( { code: "NOT_FOUND", data: { what: "msg", whatId: msgTarget.viewId, ctx: "send:reply" } } );
						return ;
					}

					sent = await this.reply( msg, msgTargetCtx );
					break;
				}
				case "dm":
				{
					sent = await this.dmSend( msg, views[0].blockCtx.authorId );
					break;	
				}
			}

			if ( !sent )
				return ;

			this.msgs.add( view.id, sent );
		}

		return ;
	}

	async update(): Promise<void>
	{
		console.log("we update tkt yipee");
	}
};