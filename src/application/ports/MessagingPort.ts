import type { View } from "application/messaging/model/View.js";
import type { LgonId } from "types/LgonId.js";
import { FlowContext, FlowData } from "application/messaging/model/Flow.js";

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
} |
{ 
	kind: "view", // always reply, to resolve
	viewId: LgonId<"view">
}

export abstract class MessagingPort
{
	constructor() {}

	abstract send<T extends FlowData>(views: View<T>[], msgTarget: MessagingTarget, ephemeral: boolean): Promise<void>;
	abstract update<T extends FlowData>(view: View<T>): Promise<void>;
	abstract delete<T extends FlowData>(view: View<T>): Promise<void>;
};
