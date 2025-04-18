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

            if ( bot.parties.get(message.guild.id).has ( "nuitFinie" ))
{
   
                const linkImage = "https://i.imgur.com/m3SG4PB.png";

                const messageEmbed = new MessageEmbed()
                    .setColor('#158373')
                    .setTitle('Récapitulatif')

                    .setDescription("Liste des joueurs par ordre d'action, leurs actions et leur rôle final")
                    .setThumbnail(linkImage)
                    .addFields(
                        //{ name: 'Regular field title', value: 'Some value here' },
                       
{ name: '\u200B', value: '\u200B' },
                    )
                    .setTimestamp()
                    .setFooter('One night Lg', linkImage);

                for (var i = 0; i < joueurs.length ; i++)
{
                    var actionStr = "Actions : ";
                    for (var j = 0; j < joueurs[i].actionStr.length; i++)
{
                        if (!(joueurs[i].actionStr[i] === false))
{
                            actionStr = `${actionStr} ${joueurs[i].actionStr[i]}`;
                        }
                    }
                    var messageText = `${joueurs[i].name} était initialement ${joueurs[i].roleInit}, a joué : ${actionStr}, a fini ${joueurs[i].roleFin}`;

                    messageEmbed.addField( `${joueurs[i].name}`, messageText, inline = false);


                }
                
                message.channel.send(messageEmbed);
            }
                        
        }
        
    }
    else
{
        message.channel.send("La commande \`joueurs\` doit être envoyée depuis un serveur et non en privé (car liée à un serveur) !");
    }
}

module.exports.help = CONSTANTES.COMMANDS.GAME.PLAYERS_DATA;