import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import type { MessageView } from "messagingFlows/model/View.js";
import type { LgonId } from "types/LgonId.js";

export type MessagingTarget =
{
	kind: "send" | "reply" | "dm",
	viewId: LgonId<"view">
}

export abstract class MessagingPort
{
	constructor() {}

	abstract send(views: MessageView[], author: LgonUser, msgTarget: MessagingTarget, ephemeral: boolean): Promise<void>;
	abstract update(): Promise<void>;
};
