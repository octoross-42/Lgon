import { Command } from "../entity/Command.js";
import { makeLgonId } from "../../../../types/LgonId.js";
const meta = {
    name: "start",
    description: "TODO",
    nbrArgsRequired: 0,
    cooldown: 2,
    where: "guild",
    aliases: new Set(["startGame"]),
    usage: "TODO",
    category: []
};
export class StartCommand extends Command {
    constructor(msgsCache, logger) {
        super(meta, msgsCache, logger);
    }
    run(lgon, message, argv) {
        const viewId = this.msgsCache.save({
            msgId: message.id,
            channelId: message.channel.id
        });
        const msgTarget = {
            kind: "reply",
            viewId: viewId
        };
        lgon.usecases.run("StartGame", makeLgonId("user", message.author.id));
    }
}
