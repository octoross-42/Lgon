import type { LgonId } from "types/LgonId.js";
import type { MessagingTarget } from "application/ports/MessagingDirective.js";

export type ViewCommand =
{
	kind: "delete" | "update",
	viewId: LgonId<"view">,
} |
{
	kind: "send",
	route: MessagingTarget
}
