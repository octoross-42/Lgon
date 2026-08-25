export type StepMode = "compact" | "long";
export const defaultStepMode: StepMode = "compact";

export class UserPreferences
{
	public stepMode: StepMode;
	public notifyError: boolean;
	public confirm: boolean;

	constructor()
	{
		this.stepMode = defaultStepMode;
		this.notifyError = true;
		this.confirm = true;
	}
}