export class UserPreferences
{
	public stepMode: "compact" | "long";
	public notifyError: boolean;
	public confirm: boolean;

	constructor()
	{
		this.stepMode = "compact";
		this.notifyError = true;
		this.confirm = true;
	}
}