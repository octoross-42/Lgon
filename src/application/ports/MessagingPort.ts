import type { DataFlow } from "application/messaging/model/Flow.js";
import { View } from "application/messaging/model/View.js";
import type { MessagingDirective, MessagingTarget } from "application/ports/MessagingDirective.js";
import type { LgonId } from "types/LgonId.js";

export type AdapterKind = "discord";

export abstract class MessagingPort
{
	constructor(public readonly kind: AdapterKind) {}

	abstract execute(views: View<DataFlow>[], target: MessagingTarget): Promise<void>;
	abstract register(id: LgonId<"adapter">, rsc: any): void;
};
