export function getRoleName(bot, roleName) {
    if (bot.roles.has(roleName))
        return (roleName);
    let role = bot.roles.find(roleFile => roleFile.aliases?.includes(roleName));
    if (!role)
        return (null);
    return (role.name);
}
export function getRole(bot, roleName) {
    let role = bot.roles.get(roleName)
        || bot.roles.find(roleFile => roleFile.aliases?.includes(roleName));
    if (!role)
        return (null);
    return (role);
}
export class LgonRoleGenerator {
    name;
    description;
    aliases;
    category;
    cdv;
    usage;
    action;
    information;
    vote;
    roleGenerator;
    constructor(help, roleGenerator) {
        this.name = help.name;
        this.description = help.description;
        this.usage = help.usage;
        this.aliases = help.aliases || [];
        this.cdv = help.cdv;
        this.action = help.action;
        this.information = help.information;
        this.vote = help.vote;
        this.category = help.category;
        this.roleGenerator = roleGenerator;
        // console.log(this.category);
    }
    getMainCategory() {
        if (this.category.length > 0)
            return (this.category[0]);
        return ("");
    }
    generateRole(owner, id) {
        let help = {
            name: this.name,
            category: this.category,
            description: this.description,
            cdv: this.cdv,
            usage: this.usage,
            action: this.action,
            information: this.information,
            vote: this.vote
        };
        return (this.roleGenerator(help, owner, id));
    }
}
