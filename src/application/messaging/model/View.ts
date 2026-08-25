import type { MessagingTarget } from "application/ports/MessagingPort.js";
import type { LgonId } from "types/LgonId.js";
import type { ButtonInteractionModel, FlowContext, DataFlow, SelectInteractionModel } from "./Flow.js";

export type ButtonView<T extends DataFlow> =
{
	model: ButtonInteractionModel<T>,
	enabled: boolean
}

export type SelectView<T extends DataFlow> =
{
	model: SelectInteractionModel<T>,
	enabled: boolean,
	selected: string[]
}

export type InteractionView<T extends DataFlow> = SelectView<T> | ButtonView<T>;

export type Script =
{
	title: string,
	description?: string,
	fields: { name: string, value: string, inline?: boolean }[]
}

export type View<T extends DataFlow> =
{
	id: LgonId<"view">,
	script: (ctx: FlowContext<T>) => Script,
	interactions: InteractionView<T>[][],
	otherModes: string[],
	currentMode: string,
	step: number,
	target: MessagingTarget,

	flowData: FlowContext<T>
}
