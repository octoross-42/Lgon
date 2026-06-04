export class RoleGenerator {
    meta;
    NightRole;
    constructor(meta, NightRole) {
        this.meta = meta;
        this.NightRole = NightRole;
        Object.assign(this, meta);
    }
    generateRole(owner, id) { return new this.NightRole(this.meta, owner); }
}
