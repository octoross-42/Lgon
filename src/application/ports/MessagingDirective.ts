import type { LgonId, LgonIdKind } from "types/LgonId.js";
import type { DataFlow, Flow } from "../messaging/model/Flow.js";
import type { UserViewCtx } from "../messaging/model/ViewStore.js";
import type { Script } from "../messaging/model/View.js";
import type { AdapterKind } from "./MessagingPort.js";

export type MessagingTargetKind = "reply" | "edit-reply" | "update" | "delete" | "dm";

export type MessagingTarget =
{
	kind: MessagingTargetKind,
	adapter: AdapterKind,
	targetId: LgonId<"adapter">,
	originAdapter: AdapterKind
};

export type DirectiveKind = "flow" | "simple";

export type FlowDirective<T extends DataFlow, D extends DirectiveKind> =
{
	kind: D,
	flow: Flow<T>,
	userCtx: UserViewCtx,
	data: T
}

export type MessageDirective<T extends DataFlow, D extends DirectiveKind> = D extends "simple" ? {
	kind: "simple",
	script: Script
} : FlowDirective<T, "flow">;

export type MessagingDirective<T extends DataFlow, D extends DirectiveKind> =
{
	msg: MessageDirective<T, D>,
	target: MessagingTarget
}

export type AnyMessagingDirective<U extends DataFlow> = U extends any ? MessagingDirective<U, DirectiveKind> : never;
