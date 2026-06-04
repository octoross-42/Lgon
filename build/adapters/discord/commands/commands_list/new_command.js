import { Command } from "../entity/Command.js";
import { makeLgonId } from "../../../../types/LgonId.js";
const meta = {
    name: "new",
    description: {
        "fr": "Créé une nouvelle partie panels (si le joueur peut) et répond avec les paneaux du jeu (controles, recap des joueurs, selection des roles)",
        "eng": "Creates a new game (if player can) and reply with the game panels (controls, players recap, roles selection)",
    },
    nbrArgsRequired: 0,
    cooldown: 2,
    where: "guild",
    aliases: new Set(["newGame", "create", "createGame"]),
    usage: "lgon new",
    category: []
};
export class CreateGameCommand extends Command {
    constructor(msgsCache, logger) {
        super(meta, msgsCache, logger);
    }
    run(lgon, message, argv) {
        const msgTarget = {
            kind: "reply",
            msgId: message.id,
            channelId: message.channel.id
        };
        lgon.usecases.run("CreateGame", makeLgonId("user", message.author.id), msgTarget, message.author.avatar);
    }
}
