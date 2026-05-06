export class UserPreferences
{
	stepMode: "compact" | "long";
	notifyError: boolean;

	constructor()
	{
		this.stepMode = "compact";
		this.notifyError = true;
	}
}