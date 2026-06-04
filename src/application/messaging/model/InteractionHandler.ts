import type { LgonId } from "types/LgonId.js";
import type { ViewStore } from "./ViewStore.js";
import type { Logger } from "infra/Logger.js";
import { FlowRunner } from "./FlowRunner.js";
import type { SelectName } from "../loadInteractions.js";

export type InteractionCtx =
{
	kind: "button",
	authorId: LgonId<"user">,
} |
{
	kind: "select",
	authorId: LgonId<"user">,
	selected: string
};

export abstract class InteractionHandler
{
	constructor(public readonly deferKind: "update" | "reply",
			public readonly kind: "button" | "select",
			protected readonly viewStore: ViewStore,
			protected readonly flowRunner: FlowRunner,
			protected readonly logger: Logger) {}
	
	abstract run(authorId: LgonId<"user">, ...args: any): Promise<void> | void;
}

export abstract class ButtonHandler extends InteractionHandler
{
	constructor(deferKind: "update" | "reply", viewStore: ViewStore, flowRunner: FlowRunner, logger: Logger) { super(deferKind, "button", viewStore, flowRunner ,logger); }

	abstract run(authorId: LgonId<"user">, contextId: string): Promise<void> | void;
}

export abstract class SelectHandler extends InteractionHandler
{
	constructor(deferKind: "update" | "reply", viewStore: ViewStore, flowRunner: FlowRunner, logger: Logger) { super(deferKind, "select", viewStore, flowRunner, logger); }

	abstract run(authorId: LgonId<"user">, selected: string[], selectId: SelectName, contextId: string): Promise<void> | void;
}
