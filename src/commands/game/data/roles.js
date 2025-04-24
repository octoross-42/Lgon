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
            var rolesJeu = bot.parties.get(message.guild.id).get("rolesJeu");

            var messageText = new String();
            if (! rolesJeu.length) messageText = "Pas de rôle en jeu";
            else
{
                messageText = `- ${rolesJeu[0]}`;
                for (var i = 1;  i < rolesJeu.length; i++ )
{
                    messageText = `${messageText} \n- ${rolesJeu[i]}`;
                }

            }
            
            const linkImage = "https://i.imgur.com/m3SG4PB.png";
            const messageEmbed = new MessageEmbed()
                    .setColor('#158373')
                    .setTitle('Partie')

                    .setDescription('La liste des rôles en jeu')
                    .setThumbnail(linkImage)
                    .addFields(
                       
{ name: '\u200B', value: '\u200B' },
                       
{ name: 'Rôles par ordre', value: messageText, inline: true },
                       
{ name: '\u200B', value: '\u200B' },
                    )
                    .setTimestamp()
                    .setFooter('One night Lg', linkImage);           
            await message.channel.send(messageEmbed);
        }
        
    }
    else
{
        await message.channel.send("La commande \`rôles\` doit être envoyée depuis un serveur et non en privé (car liée à une partie) !");
    }
}

module.exports.help = CONSTANTES.COMMANDS.GAME.ROLES_DATA;