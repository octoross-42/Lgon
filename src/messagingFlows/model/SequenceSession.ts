import type { LgonContext } from "../../application/context/LgonContext.js";
import type { LgonId } from "../../types/LgonId.js";
import type { LgonUser } from "../../domain/game/entities/LgonUser/LgonUser.js";
import type { SequenceDefinition } from "./Flow.js";

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

	constructor(
		public readonly lgon: LgonContext,
		userId: LgonId<"user">,
		public readonly sequence: SequenceDefinition)
	{
		this.currentStep = 0;
		const user: LgonUser | undefined = lgon.users.get(userId);
		this.stepMode = "compact";
		if ( user )
			this.stepMode = user.preferences.stepMode;

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
