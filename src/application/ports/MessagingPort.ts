import type { LgonContext } from "../context/LgonContext.js";

type MessagingTarget =
	| { kind: "channel"; channelId: string }
	| { kind: "message"; channelId: string; messageId: string }
	| { kind: "interaction"; interactionId: string }
	| { kind: "dm"; userId: string };

export interface MessagingPort
{
	send(lgon: LgonContext, msgTarget: MessagingTarget): Promise<void>;
	update(lgon: LgonContext): Promise<void>;
};