import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { MessageView } from "application/messaging/model/View.js";

export type MessagingTarget =
{
	kind: "send"
	channelId: string
} |
{
	kind: "reply",
	msgId: string,
	channelId: string
} |
{
	kind: "dm",
	userId: string
}

export abstract class MessagingPort
{
	constructor() {}

	abstract send(views: MessageView[], author: LgonUser, msgTarget: MessagingTarget, ephemeral: boolean): Promise<void>;
	abstract update(): Promise<void>;
};
