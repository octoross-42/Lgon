export class LgonRoleGeneratorRegistry {
    roles;
    constructor(roles) {
        this.roles = roles;
    }
    get(roleName) { return (this.roles.get(roleName)); }
    getDescriptions() {
        let descriptions = [];
        for (const role of this.roles.values())
            descriptions.push({ id: role.meta.id, name: role.meta.name, description: role.meta.description });
        return (descriptions);
    }
}
