export class InGame {
    role;
    nightyRole;
    ready;
    constructor(role) {
        this.ready = false;
        this.role = role;
        this.nightyRole = role;
    }
    setReady(ready) {
        this.ready = ready;
    }
}
