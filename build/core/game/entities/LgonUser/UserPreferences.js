export class UserPreferences {
    stepMode;
    notifyError;
    confirm;
    constructor() {
        this.stepMode = "compact";
        this.notifyError = true;
        this.confirm = true;
    }
}
