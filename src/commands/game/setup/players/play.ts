import { CONSTANTES } from "../../../../config/constantes.js";
import { Client, Message } from "discord.js";

export function run(bot: Client, message: Message, argv: string[]): Promise<void> | void
{
	// console.log(message.author);
	// console.log(message.guild);
}

export const meta =
{
	name : "play",
	description : "Exécute l'action d'un joueur",
	nbrArgsRequired : 0,
	cooldown: 1,
	where: "dm",
	aliases: ["action"], 
	usage : `\`${CONSTANTES.PREFIX} action\` seul pour la liste des rôles sinon \`<role_name>\` pour l'aide sur le rôle`,
};
