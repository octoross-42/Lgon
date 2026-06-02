import type { LgonId } from "types/LgonId.js";

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

export abstract class InteractionReply
{
	constructor(public readonly deferKind: "update" | "reply") {}
	
	abstract run(authorId: LgonId<"user">): Promise<void> | void;
}
