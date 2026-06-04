import type { MessagingTarget } from "application/ports/MessagingPort.js";
import type { LgonId } from "types/LgonId.js";
import type { Script } from "./Script.js";
import type { ButtonInteractionModel, ButtonBuild, SelectBuild, ModeDefinition, MessageDefinition, SelectInteractionModel } from "./Flow.js";

export type ButtonView =
{
	model: ButtonInteractionModel,
	enabled: boolean
}

export type SelectView =
{
	model: SelectInteractionModel,
	enabled: boolean,
	selected: string[]
}

export type InteractionView = SelectView | ButtonView;

export type MessageView =
{
	id: LgonId<"view">,
	script: Script,
	interactions: InteractionView[][],
	otherModes: string[],
	currentMode: string,
	step: number,
	target: MessagingTarget,

	blockCtx: MsgBlockCtx
}

export type MsgBlockCtx =
{
	authorId: LgonId<"user">,
	stepMode: "compact" | "long",
	step: number,
	originMsgTarget: MessagingTarget,
	data?: any
}
