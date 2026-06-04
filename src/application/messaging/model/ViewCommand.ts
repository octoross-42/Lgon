import type { LgonId } from "types/LgonId.js";
import type { MessagingTarget } from "application/ports/MessagingPort.js";

export type ViewCommand =
{
	kind: "delete" | "update",
	viewId: LgonId<"view">,
} |
{
	kind: "send",
	target: MessagingTarget
}
