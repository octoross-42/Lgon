import type { LgonContext } from "../../application/context/LgonContext.js";
import type { LgonId, LgonIdKind } from "../../types/LgonId.js";
import type { LgonUser } from "../../domain/game/entities/LgonUser/LgonUser.js";
import type { SequenceDefinition } from "./Flow.js";
import { SequenceContext } from "./View.js";

export type StepData = 
{
	currentMode: string;
	interactionChoices: Record<string, string[][][]>;
}

export class SequenceSession
{
	currentStep: number;
	stepMode: "compact" | "long";
	nbrSteps: number;
	stepsData: StepData[];
	contextId: LgonId<LgonIdKind>;
	userId: LgonId<"user">;

	constructor(
		public readonly lgon: LgonContext,
		public readonly id: string,
		sequenceContext: SequenceContext,
		public readonly sequence: SequenceDefinition)
	{
		this.contextId = sequenceContext.contextId;
		this.userId = sequenceContext.userId;
		this.currentStep = sequenceContext.step;
		this.stepMode = sequenceContext.stepMode;

		this.nbrSteps = this.sequence.steps.length;
		// TODO check qu'il y ait au moins 1 step

		this.stepsData = this.sequence.steps.map(step => (	
			{
				currentMode: step.defaultMode,
				interactionChoices: Object.fromEntries(
					step.modes.map(mode => [
						mode.mode,
						mode.interactions.map( (interactionRow) =>
							interactionRow.map( (interaction) =>
						{
							if (interaction.kind === "select")
								return ([ interaction.build.placeholder ]);
							else
								return [];
						}))
					])	
				) as Record<string, string[][][]>
			}
		));
	}

	nextStep(): boolean
	{
		if (this.nbrSteps === 1)
			return (false);

		this.currentStep = (this.currentStep + 1) % this.nbrSteps;
		return (true);
	}

	prevStep(): boolean
	{
		if (this.nbrSteps === 1)
			
			return (false);

		this.currentStep = (this.currentStep - 1) % this.nbrSteps;
		return (true);
	}
}
