import { MessagingPort } from "../../../application/ports/MessagingPort.js";
import { EmbedBuilder } from "discord.js";
import { ComponentMaker } from "./ComponentMaker.js";
export class DiscordMessenger extends MessagingPort {
    bot;
    msgs;
    logger;
    componentMaker;
    constructor(bot, msgs, logger) {
        super();
        this.bot = bot;
        this.msgs = msgs;
        this.logger = logger;
        this.componentMaker = new ComponentMaker(this.logger);
    }
    async edit(msg, msgRef) {
        const channel = this.bot.channels.cache.get(msgRef.channelId);
        if (!channel) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "discord channel", whatId: msgRef.channelId, ctx: "discord messenger edit" } });
            return;
        }
        if (!channel?.isSendable()) {
            this.logger.event({ code: "NOT_SENDABLE", data: { channelId: msgRef.channelId } });
            return;
        }
        const msgDiscord = channel.messages.cache.get(msgRef.msgId);
        if (!msgDiscord) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "discord message", whatId: `msgId: ${msgRef.msgId}, channelId: ${msgRef.channelId}`, ctx: "discord messenger edit" } });
            return;
        }
        await msgDiscord.edit(msg);
    }
    async guildSend(msg, channelId) {
        const channel = this.bot.channels.cache.get(channelId);
        if (!channel) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "discord channel", whatId: channelId, ctx: "send:reply" } });
            return;
        }
        if (channel?.isSendable()) {
            const sent = await channel.send(msg);
            return ({
                channelId: sent.channel.id,
                msgId: sent.id
            });
        }
        else
            this.logger.event({ code: "NOT_SENDABLE", data: { channelId: channelId } });
    }
    async reply(msg, msgTargetCtx) {
        const channel = this.bot.channels.cache.get(msgTargetCtx.channelId);
        if (!channel) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "discord channel", whatId: msgTargetCtx.channelId, ctx: "send:reply" } });
            return;
        }
        if (channel?.isSendable()) {
            const replyTo = channel.messages.cache.get(msgTargetCtx.msgId);
            if (!replyTo) {
                this.logger.event({ code: "SEND_CHANNEL_INSTEAD", data: { channelId: msgTargetCtx.channelId, msgId: msgTargetCtx.msgId } });
                const sent = await channel.send(msg);
                return ({
                    channelId: sent.channel.id,
                    msgId: sent.id
                });
            }
            else {
                const sent = await replyTo.reply(msg);
                return ({
                    channelId: sent.channel.id,
                    msgId: sent.id
                });
            }
        }
        else
            this.logger.event({ code: "NOT_SENDABLE", data: { channelId: msgTargetCtx.channelId } });
    }
    async dmSend(msg, userId) {
        const user = this.bot.users.cache.get(userId);
        if (!user) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "discord user", whatId: userId, ctx: "send:dm" } });
            return;
        }
        const sent = await user.send(msg);
        return {
            channelId: sent.channel.id,
            msgId: sent.id
        };
    }
    makeMsgPayload(view, epheremal = false) {
        let embed = new EmbedBuilder();
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
            components: this.componentMaker.make(view.interactions, view.id, view.flowData)
        });
    }
    async send(views, msgTarget, epheremal) {
        for (const view of views) {
            const msg = this.makeMsgPayload(view, epheremal);
            let sent;
            switch (msgTarget.kind) {
                case "send":
                    {
                        sent = await this.guildSend(msg, msgTarget.channelId);
                        break;
                    }
                case "reply":
                    {
                        sent = await this.reply(msg, { msgId: msgTarget.msgId, channelId: msgTarget.channelId });
                        break;
                    }
                case "dm":
                    {
                        sent = await this.dmSend(msg, msgTarget.userId);
                        break;
                    }
                case "view":
                    {
                        const realMsgTarget = this.msgs.get(msgTarget.viewId);
                        if (!realMsgTarget) {
                            this.logger.event({ code: "NOT_FOUND", data: { what: "message ref", whatId: msgTarget.viewId, ctx: "discord messenger send view" } });
                            return;
                        }
                        sent = await this.reply(msg, realMsgTarget);
                        break;
                    }
            }
            if (!sent)
                return;
            this.msgs.add(view.id, sent);
        }
        return;
    }
    async update(view) {
        const viewRef = this.msgs.get(view.id);
        if (!viewRef) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "view message ref", whatId: `${view.id}`, ctx: "discord messenger update" } });
            return;
        }
        this.edit(this.makeMsgPayload(view), viewRef);
    }
    async delete(view) {
        const viewRef = this.msgs.get(view.id);
        if (!viewRef) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "view message ref", whatId: `${view.id}`, ctx: "discord messenger update" } });
            return;
        }
        const channel = this.bot.channels.cache.get(viewRef.channelId);
        if (!channel) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "discord channel", whatId: viewRef.channelId, ctx: "send:reply" } });
            return;
        }
        if (!channel?.isSendable()) {
            this.logger.event({ code: "NOT_SENDABLE", data: { channelId: viewRef.channelId } });
            return;
        }
        const discordMsg = channel.messages.cache.get(viewRef.msgId);
        if (!discordMsg) {
            this.logger.event({ code: "NOT_FOUND", data: { what: "discord msg", msgId: `msgId: ${viewRef.msgId}, channelId: ${viewRef.channelId}` } });
            return;
        }
        await discordMsg.delete();
    }
}
;
