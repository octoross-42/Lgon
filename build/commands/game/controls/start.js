import { CONSTANTES } from "../../../config/constantes.js";
import { getPlayer } from "../../../classes/Game/Player.js";
import { StartEmbed } from "../../../classes/Embed/StartEmbed.js";
// TODO envoyer tous les actions dispos en debut de nuit sauf les actions avec vision
export async function run(bot, message, argv) {
    let player = getPlayer(bot, message.author);
    let startEmbed = new StartEmbed(player);
    await startEmbed.send(bot, message);
}
export const help = CONSTANTES.COMMANDS.GAME.CONTROLS.START;
