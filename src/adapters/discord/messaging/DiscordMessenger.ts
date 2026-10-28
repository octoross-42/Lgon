import { AdapterKind, MessagingPort } from "application/ports/MessagingPort.js";
import { type Client, EmbedBuilder, Message, type User, BaseMessageOptions, type ChatInputCommandInteraction, type MessageContextMenuCommandInteraction, type UserContextMenuCommandInteraction, type PrimaryEntryPointCommandInteraction, type AnySelectMenuInteraction, type ButtonInteraction, type ModalSubmitInteraction, InteractionReplyOptions, Channel, SendableChannels, InteractionResponse } from "discord.js";
import type { Script, View } from "application/messaging/model/View.js";
import { ComponentMaker } from "./ComponentMaker.js";
import type { DiscordMessagingCache } from "../store/DiscordMessagingCache.js";
import type { Logger } from "infra/Logger.js";
import type { DataFlow } from "application/messaging/model/Flow.js";
import type { MessageDirective, MessagingDirective, MessagingRoute, MessagingTarget, MessagingTargetKind } from "application/ports/MessagingDirective.js";
import { makeLgonId, type LgonId } from "types/LgonId.js";

type DiscordRepliable = ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction | AnySelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction | Message;
type DiscordEditable = InteractionResponse | Message;
type DiscordDeletable = InteractionResponse | Message;
type DiscordEditRepliable = ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction | AnySelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction;

export type DiscordResource = InteractionResponse| SendableChannels | User | DiscordRepliable;
export type MessagingOptions = Pick<BaseMessageOptions & InteractionReplyOptions, "components" | "allowedMentions" | "embeds">;
type RespondingTargetMethods = "reply" | "edit-reply" | "update" | "delete" | "follow-up" | "delete-reply";

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
		// do not delete view, save context and choices, messenger does not get to make the decision
	}


	private makeTargetKind(route: MessagingRoute<AdapterKind>): MessagingTargetKind<"discord"> | undefined
	{
		if (route.originAdapter != "discord")
		// TODO for the moment, jsp ce que je veux faire donc on fait pas
			return (undefined);

		switch (route.intention)
		{
			case ("reply"):
			{
				if (route.sourceKind === "interaction")
					return ("follow-up");
				return ("reply");
			}
			
			case ("error"):
			case ("personal-reply"):
			{
				if (route.sourceKind === "interaction")
					return ("edit-reply");
				return ("reply");
			}
			case ("auto-update"):
			case ("update"):
			{
				if (route.sourceKind === "interaction")
					return ("edit-reply");
				return ("update");
			}
			case ("delete"):
			{
				if (route.sourceKind === "interaction")
					return ("delete-reply");
				return ("delete");
			}
			case ("dm"):
				return ("dm");
			default:
				return (undefined);
		}
	}

	public async execute(directive: MessagingDirective<DataFlow>): Promise<void>
	{
		const RESPONDING_TARGET_METHODS = new Map<MessagingTargetKind<"discord">, string>([
			["reply", "reply"],
			["edit-reply", "editReply"],
			["update", "update"],
			["delete", "delete"],
			["follow-up", "followUp"],
			["delete-reply", "deleteReply"],
		]);

		const rsc: DiscordResource | undefined = this.cache.get(directive.route.adapterId);
		if ( !rsc )
		{
			this.logger.event( { code: "TARGET_NOT_FOUND", data: { id: directive.route.adapterId, adapter: "discord" } } );
			return ;
		}
		
		const targetKind: MessagingTargetKind<"discord"> | undefined = this.makeTargetKind(directive.route);
		if ( !targetKind )
		{
			this.logger.event( { code: "IMPOSSIBLE_TARGET_KIND", data: { messagingIntention: directive.route.intention, adapter: "discord", originAdapter: directive.route.originAdapter, sourceKind: directive.route.sourceKind } } );
			return ;
		}

		const target: MessagingTarget =
		{
			kind: targetKind,
			adapterId: directive.route.adapterId
		}
		let i: number = 0;
		let msgingOptions: MessagingOptions;
		let methodString: string | undefined;

		// "reply" | "edit-reply" | "update" | "delete" | "dm" | "follow-up" | "delete-reply"
		i = (target.kind in ["edit-reply", "update", "delete", "delete-reply"] ? (directive.views.length - 1): 0);
		while (i < directive.views.length)
		{
			methodString = RESPONDING_TARGET_METHODS.get(target.kind);
			if ( methodString && !(methodString in rsc) )
			{
				this.logger.event({ code: "IMPOSSIBLE_TARGET", data: { ...target, missingMethod: "reply" } });
				i ++;
				continue ;
			}

			msgingOptions = this.makeMsgPayload(directive.views[i ++]);
			
			switch (target.kind)
			{
				case ("reply"):
				{
					await this.reply(rsc as DiscordRepliable, msgingOptions);
					break ;
				}
				case ("edit-reply"):
				{
					await this.editReply(rsc as DiscordEditRepliable, msgingOptions);
					break ;
				}
				// case ("update")
				// {
				// 	await this.update(rsc);
				// 	break ;
				// }
				// case ("delete")
				// {
				// 	await this.
				// 	break ;
				// }
				// case ("dm")
				// {
				// 	await this.
				// 	break ;
				// }
				// case ("follow-up")
				// {
				// 	await this.
				// 	break ;
				// }
				// case ("delete-reply")
				// {
				// 	await this.
				// 	break ;
				// }
			}	
		}
	}
};
