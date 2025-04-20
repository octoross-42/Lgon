import { Client, MessageReaction, User } from "discord.js";
// import { CONSTANTES } from "../config/constantes.js";

export function onEvent(bot: Client, reaction: MessageReaction, user: User): void
{
    if (user.bot)
		return;
    
	// console.log("Reaction received : ", reaction.emoji);

//     let partieBool = bot.parties.has(reaction.message.guild.id) && !(bot.parties.get(reaction.message.guild.id) === false);

//     if (reaction.message.guild && partieBool)
// 	{ // si une partie est commencée et si on est sur un serveur

//         if (!bot.messagesRoles.has(reaction.message.guild.id)) return;
//         const messagesAReagir = bot.messagesRoles.get(reaction.message.guild.id);

//         var boolM = false;
//         var indiceM = false;
//             for(var i = 0; i < messagesAReagir.length; i++)
// 			{
//                 if (reaction.message.id === messagesAReagir[i].id)
// 				{
//                     indiceM = i;
//                     boolM = true;
//                     break;
//                 }
//             }

//         if (boolM && !(indiceM === false))
// { // si le message auquel on a réagit est parmi ceux qu'on attend
//             const role = reaction.message.content;
                
//             var rolesJeu = bot.parties.get(reaction.message.guild.id).get("rolesJeu");



//             if (['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].includes(reaction.emoji.name)){
                    
//                 rolesJeu = enleve(role, rolesJeu);
                
// 				var roleAddedNbr = 0;
// 				switch (reaction.emoji.name)
// 				{
// 					case '0️⃣':
// 						return ;
// 					case '1️⃣':
// 						roleAddedNbr = 1;
// 						break;
// 					case '2️⃣':
// 						roleAddedNbr = 2;
// 						break;
// 					case '3️⃣':
// 						roleAddedNbr = 3;
// 						break;
// 					case '4️⃣':
// 						roleAddedNbr = 4;
// 						break;
// 					case '5️⃣':
// 						roleAddedNbr = 5;
// 						break;

// 				}
                
// 				var i = 0;
// 				while (i < roleAddedNbr)
// 				{
//                     rolesJeu.push(CONSTANTES.ROLES[indiceM]);
// 					i ++;
// 				}
               

//                 const joueurs = bot.joueurs.get( reaction.message.guild.id );
//                 if ((joueurs.length + 3 === rolesJeu.length) && (joueurs.length >= CONSTANTES.MIN_NBR_PLAYERS) )
// 				    verificationDebutNuit(bot, reaction.message.guild.id);
//             }
//         }
//     }
}

export const name = "messageReactionAdd";