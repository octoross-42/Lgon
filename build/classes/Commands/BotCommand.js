import { CONSTANTES } from "../../config/constantes.js";
export class BotCommand {
    name;
    description;
    usage;
    defaultUsage;
    aliases;
    cooldown;
    nbrArgsRequired;
    category;
    where;
    run;
    constructor(help, commandFilePath, run) {
        this.name = help.name;
        this.description = help.description;
        this.defaultUsage = true;
        this.where = help.where;
        this.usage = `\`${CONSTANTES.PREFIX} ${help.name}\``;
        if (help.usage) {
            this.usage = help.usage;
            this.defaultUsage = false;
        }
        this.aliases = help.aliases || [];
        this.cooldown = help.cooldown;
        this.nbrArgsRequired = help.nbrArgsRequired;
        const path = commandFilePath.split("/");
        const initPath = path.indexOf("commands");
        this.category = path.slice(initPath + 1, -1);
        //   console.log(this.category);
        this.run = run;
    }
    getMainCategory() {
        if (this.category.length > 0)
            return (this.category[0]);
        return ("");
    }
}
