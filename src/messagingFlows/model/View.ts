import { LgonId, LgonIdKind } from "src/types/LgonId.js";
import type { ButtonBuild, SelectBuild, MessageScript, SequenceDefinition, ModeDefinition, MessageDefinition } from "./Flow.js";

type ButtonView =
{
	kind: "button",
	build: ButtonBuild
}

type SelectView =
{
	kind: "select",
	build: SelectBuild
}

export type InteractionView = ButtonView | SelectView;

export type MessageView =
{
	script: MessageScript,
	interactions: InteractionView[][],
	otherModes: string[]
}

export type SequenceView = MessageView[];

export type SequenceContext =
{
	contextId: LgonId<LgonIdKind>,
	userId: LgonId<"user">,
	step: number,
	stepMode: "compact" | "long"
}

function addMessageViewOf(sequenceView: MessageView[], messageDef: MessageDefinition, sequenceContext: SequenceContext, messageMode: string): void
{
	let otherModes: string[] = [];
	let modeDef: ModeDefinition | undefined;
	let j: number = 0;
	
	while (j < messageDef.modes.length)
	{
		if ( messageDef.modes[j].mode === messageMode )
			modeDef = messageDef.modes[j];
		else
			otherModes.push(messageDef.modes[j].mode);
		j ++;
	}
	
	if ( !modeDef )
		return ;

	sequenceView.push (
		{
			script: modeDef.script(sequenceContext.contextId, sequenceContext.userId),
			interactions: modeDef.interactions.map(interactionRow => (interactionRow.map(interaction => {
				if (interaction.kind === 'button')
					return { kind: 'button', build: interaction.build } as ButtonView
				else
					return { kind: 'select', build: interaction.build } as SelectView
			}))),
			otherModes: otherModes
		}
	);
}


export function sequenceViewOf(sequenceDef: SequenceDefinition, sequenceContext: SequenceContext): SequenceView // TOUT REFAIRE
{
	let sequenceView: MessageView[] = [];
	let i: number = 0;
	let messageView: MessageView | null;

	if ( sequenceContext.stepMode === "long" )
	{
		while (i < sequenceDef.steps.length)
			addMessageViewOf(sequenceView, sequenceDef.steps[i ++], sequenceContext, messageMode);
	}
	else if (sequenceContext.step < sequenceDef.steps.length)
		addMessageViewOf(sequenceView, sequenceDef.steps[sequenceContext.step], sequenceContext, messageMode);
	
	return (sequenceView);
}