import type { LgonId } from "types/LgonId.js";
import type { DataFlow, Flow } from "../messaging/model/Flow.js";
import type { UserViewCtx } from "../messaging/model/ViewStore.js";
import type { Script, View } from "../messaging/model/View.js";
import type { AdapterKind, AdapterSourceKind } from "./MessagingPort.js";

export type MessageDirectiveKind = "flow" | "simple" | "view";

export type MessageDirective<T extends DataFlow, D extends MessageDirectiveKind> = D extends "simple" ? {
	kind: "simple",
	script: Script
} : (D extends "flow" ? {
	kind: "flow",
	flow: Flow<T>,
	userCtx: UserViewCtx,
	data: T
} :
{
	kind: "view",
	viewId: LgonId<"view">
});

export type MessagingSource<A extends AdapterKind> =
{
	adapterId: LgonId<"adapter">,
	adapter: A,
	kind: AdapterSourceKind<A>
}

export type DiscordTargetKind = "reply" | "edit-reply" | "update" | "delete" | "dm" | "follow-up" | "delete-reply";
export type MessagingTargetKind<A extends AdapterKind> =
	A extends "discord" ? DiscordTargetKind:
	never;

export type MessagingIntention = "reply" | "error" | "auto-update" | "update" | "delete" | "dm" | "personal-reply";
type SimpleIntention = Exclude<MessagingIntention, "auto-update">;

export type MessagingRoute<A extends AdapterKind> =
{
	intention: MessagingIntention,
	sourceKind: AdapterSourceKind<A>,
	adapterId: LgonId<"adapter">,
	originAdapter: A
};

export type MessagingTarget =
{
	kind: MessagingTargetKind<AdapterKind>;
	adapterId: LgonId<"adapter">,
};

export type MessagingRequest<T extends DataFlow, D extends MessageDirectiveKind> =
{
	msg: MessageDirective<T, D>,
	intention: SimpleIntention,
	source: MessagingSource<AdapterKind>
} |
{
	msg: MessageDirective<T, D>,
	intention: "auto-update",
	source: MessagingSource<AdapterKind>
	propagateIds: Set<LgonId<"property">>
}

export type AnyMessagingRequest<T extends DataFlow> = T extends DataFlow ? MessagingRequest<T, MessageDirectiveKind>: never;

export type MessagingDirective<T extends DataFlow> =
{
	views: View<T>[],
	route: MessagingRoute<AdapterKind>
};
