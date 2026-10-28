import type { DataFlow } from "application/messaging/model/Flow.js";
import type { MessagingDirective } from "application/ports/MessagingDirective.js";
import type { LgonId } from "types/LgonId.js";

export type AdapterKind = "discord";

type DiscordSourceKind = "interaction" | "message";
export type AdapterSourceKind<A extends AdapterKind> =
	A extends "discord" ? DiscordSourceKind:
	never;

export abstract class MessagingPort
{
	constructor(public readonly kind: AdapterKind) {}

	abstract execute(directive: MessagingDirective<DataFlow>): Promise<void>;
	abstract register(id: LgonId<"adapter">, rsc: any): void;
};
