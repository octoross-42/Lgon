import type { ScriptName } from "../loadScripts.js";

export type InteractionKind = "button" | "select";
export type LgonButtonStyle = "blue" | "red" | "green" | "grey" | "link";

export type ButtonBuild =
{
	label: string;
	style: LgonButtonStyle;
};

export type SelectOption = { label: string; value: string; description?: string };
export type SelectBuild =
{
	placeholder: string;
	options: SelectOption[];
	minValues: number;
	maxValues: number;
};

export type InteractionIdKind = "game" | "user";

export type ButtonInteractionModel =
{
	kind: "button",
	build: ButtonBuild,
	id: string,
	customIdKind: InteractionIdKind; 
	// onSubmit: (contextId: string, userId: string) => Promise<void> | void 
}

export type SelectInteractionModel =
{
	kind: "select",
	build: SelectBuild,
	id: string,
	customIdKind: InteractionIdKind;
	// onSubmit: (contextId: string, userId: string) => Promise<void> | void 
}

export type InteractionModel = ButtonInteractionModel | SelectInteractionModel;

export type ModeDefinition =
{
	mode: string,
	script: ScriptName,
	interactions: InteractionModel[][]
}

export type MessageDefinition =
{
	modes: ModeDefinition[];
	defaultMode: string;
};

export type MessageBlock =
{
	id: string;
	steps: MessageDefinition[];
}

export type Flow = MessageBlock[];