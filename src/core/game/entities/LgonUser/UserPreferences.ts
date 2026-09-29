export type StepMode = "compact" | "long";
export const DEFAULT_STEPMODE: StepMode = "compact";

export class UserPreferences
{
	public stepMode: StepMode;
	public notifyError: boolean;
	public confirm: boolean;

	constructor()
	{
		this.stepMode = DEFAULT_STEPMODE;
		this.notifyError = true;
		this.confirm = true;
	}
}