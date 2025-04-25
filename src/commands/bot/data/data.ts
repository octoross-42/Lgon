import { BotCommand } from "src/types/BotCommand.js";
import { CONSTANTES } from "../../../config/constantes.js";
import { Client, Message, EmbedBuilder } from "discord.js";

export function run(bot: Client, message: Message, argv: string[]): Promise<void> | void
{
//     message.author.createDM().then (channel =>
// {

//         var messagesChannelsJeu = new String() ; 
//         if (bot.channelsJeu.has(message.channel.guild.id))
// {
//             const channelsJeu = bot.channelsJeu.get(message.channel.guild.id);
//             messagesChannelsJeu = `${messagesChannelsJeu}\n "deroulement-jeu" -> ${channelJeu.get('deroulement-jeu')}`;
//             messagesChannelsJeu = `${messagesChannelsJeu}\n "ROLES_DATA" -> ${channelJeu.get('ROLES_DATA')}`;
//             messagesChannelsJeu = `${messagesChannelsJeu}\n "erreurs" -> ${channelJeu.get('erreurs')}`;
//         }
//         else
// {
//             messagesChannelsJeu = "Aucune donnée" ;
//         }

//         var messagesJoueurs = new String() ; 
//         if (bot.joueurs.has(message.channel.guild.id))
// {
//             const joueurs = bot.joueurs.has(message.channel.guild.id);
//         }
//         else
// {
//             messagesJoueurs = "Aucune donnée" ;
//         }

//         var messagesPartie = new String();
//         if (bot.parties.has(message.channel.guild.id))
// {
//             const partie = bot.parties.get(message.channel.guild.id);
//         }
//         else
// {
//             messagesPartie = "Aucune donnée" ;
//         }

//         var messagesMessagesRoles = new String();
//         if (bot.messagesRoles.has(message.channel.guild.id))
// {
//             const messagesRoles = bot.messagesRoles.get(message.channel.guild.id);
//         }
//         else
// {
//             messagesMessagesRoles = "Aucune donnée" ;
//         }

//         var messagesJoueur = new String();
//         if (bot.joueur.has (message.author.id) )
// {
//             const joueur = bot.joueur.get (message.author.id);
//         }
//         else
// {
//             messagesJoueur = "Aucune donnée" ;
//         }
       


//         const linkImage = "https://i.imgur.com/m3SG4PB.png";
//         const messageEmbed = new EmbedBuilder()
//         .setColor('#158373')
//         .setTitle('Infos')

//         .setDescription(`Toutes les infos pour la guild ${message.channel.guild.id}`)
//         .setThumbnail(linkImage)
//         .addFields(
//             //{ name: 'Regular field title', value: 'Some value here' },
           
// { name: '\u200B', value: '\u200B' },
           
// { name: 'Les channels de jeu', value: messagesChannelsJeu, inline: false },
           
// { name: '\u200B', value: '\u200B' },
           
// { name: 'Les joueurs', value: messagesJoueurs, inline: false },
           
// { name: '\u200B', value: '\u200B' },
           
// { name: 'La partie', value: messagesPartie, inline: false },
           
// { name: '\u200B', value: '\u200B' },
           
// { name: 'Les joueurs', value: messagesJoueurs, inline: false },
           
// { name: '\u200B', value: '\u200B' },
           
// { name: 'Les Messages Rôles', value: messagesMessagesRoles, inline: false },
           
// { name: '\u200B', value: '\u200B' },
           
// { name: 'Joueur', value: messagesJoueur, inline: false },
            
//         )
//         //.addField('Inline field title', 'Some value here', false)
//         //.setImage('https://i.imgur.com/m3SG4PB.png')
//         .setTimestamp()
//         .setFooter('One night Lg', linkImage);

//         channel.send(messageEmbed);
        
//     })
}

export const help = CONSTANTES.COMMANDS.BOT.DATA.DATA;