export type MessageScript =
{
	title: string,
	description?: string,
	fields: { title?: string, value: string, inline?: boolean }[]
}

export type InteractionKind = "button" | "select";

export type ButtonBuild =
{
	label: string;
	style: string;
};

export type SelectOption = { label: string; value: string; description?: string };
export type SelectBuild =
{
	placeholder: string;
	options: SelectOption[];
	minValues: number;
	maxValues: number;
};

type ButtonInteraction =
{
	kind: "button",
	build: ButtonBuild,
	onSubmit: (contextId: string, userId: string) => Promise<void> | void 
}

type SelectInteraction =
{
	kind: "select",
	build: SelectBuild,
	onSubmit: (contextId: string, userId: string) => Promise<void> | void 
}

export type LgonInteraction = ButtonInteraction | SelectInteraction;

export type ModeDefinition =
{
	mode: string,
	script: (contextId: string, userId: string) => MessageScript,
	interactions: LgonInteraction[][]
}

export type MessageDefinition =
{
	modes: ModeDefinition[];
	defaultMode: string;
};

export type SequenceDefinition =
{
	id: string;
	steps: MessageDefinition[];
}

export type Flow = SequenceDefinition[];