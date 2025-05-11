import { EmbedBuilder } from "discord.js";
export class LgonEmbed {
    embed;
    register;
    constructor() {
        this.embed = LgonEmbed.newEmbed();
        this.register = false;
    }
    static newEmbed() {
        let embed = new EmbedBuilder()
            .setColor('#158373');
        return (embed);
    }
}
;
