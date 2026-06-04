export class Player {
    user;
    role;
    actionRole;
    // dayRole: DayRole | null;
    ready;
    status;
    constructor(user) {
        this.role = null;
        this.actionRole = null;
        this.ready = false;
        this.user = user;
        this.status = new Set();
    }
    attributeRole(role) {
        this.actionRole = role.generateRole(this, 1);
    }
}
