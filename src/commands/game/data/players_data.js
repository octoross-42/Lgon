const
{ CONSTANTES } = require ("../../../config/constantes.js");
const
{MessageEmbed} = require('discord.js');

module.exports.run = (bot, message, argsMessage) =>
{
    if (message.guild)
{
        if (bot.parties.has(message.guild.id)  && !(bot.parties.get(message.guild.id) === false))
{  // si une partie est lancée sur le serveur
            
            const joueurs = bot.joueurs.get(message.guild.id);

            if ( bot.parties.get(message.guild.id).has ( "preparationFinie" ))
{

                var messageText = "Voici la liste des joueurs : \n";
                for (var i = 0;  i < joueurs.length; i++ )
{
                    messageText = `${messageText} \n${joueurs[i].name}`;
                }
                await message.channel.send(messageText);

            }
            else
{
                var messageText = new String();
                var joueursOrdre = new Array();
                for (var i = 0;  i < joueurs.length; i++ )
{
                    joueursOrdre.push(false);
                }

                for (var i = 0;  i < joueurs.length; i++ )
{
                    joueursOrdre [ joueurs[i].indiceInit ] = joueurs[i].name ;
                }
                for (var i = 0;  i < joueursOrdre.length; i++ )
{
                    messageText = `${messageText} \n${i+1}. ${joueursOrdre[i]}`;
                }
                if (! messageText.length) messageText = "Pas de joueur";

  
                const linkImage = "https://i.imgur.com/m3SG4PB.png";

                const messageEmbed = new MessageEmbed()
                    .setColor('#158373')
                    .setTitle('Partie')

                    .setDescription('Liste des joueurs')
                    .setThumbnail(linkImage)
                    .addFields(
                        //{ name: 'Regular field title', value: 'Some value here' },
                       
{ name: '\u200B', value: '\u200B' },
                       
{ name: 'Joueurs par ordre', value: messageText, inline: true },
                       
{ name: '\u200B', value: '\u200B' },
                    )
                    .setTimestamp()
                    .setFooter('One night Lg', linkImage);           
                await message.channel.send(messageEmbed);
            }
                        
        }
        
    }
    else
{
        await message.channel.send("La commande \`joueurs\` doit être envoyée depuis un serveur et non en privé (car liée à un serveur) !");
    }
}

module.exports.help = CONSTANTES.COMMANDS.GAME.PLAYERS_DATA;