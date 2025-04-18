const
{ CONSTANTES } = require ("../../../config/constantes.js");
const
{ verificationDebutNuit } = require("../../fonctions/verificationDebutNuit.js");

module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has( message.channel.guild.id))
	{
        const partie = bot.parties.get( message.channel.guild.id);
        const joueurs = bot.joueurs.get( message.channel.guild.id);

        const rolesJeu = partie.get("rolesJeu");
        if (rolesJeu.length === joueurs.length + 3)
            verificationDebutNuit( bot, message.channel.guild.id);

        else
{
            var joueursNames = `1. ${joueurs[0].name}`;
            var rolesString = rolesJeu[0];

            for (var i = 1; i < rolesJeu.length; i++)
{
                rolesString = `${rolesString}\n${rolesJeu[i]}`;
            }
            for (var i = 1; i < joueurs.length; i++)
{
                joueursNames = `${joueursNames}\n${i+1}. ${joueurs[i].name}`;
            }

            const linkImage = "https://i.imgur.com/m3SG4PB.png";

            const messageEmbed = new MessageEmbed()
                .setColor('#158373')
                .setTitle('Etat actuel du jeu')

                .setDescription('Les nombres ne matchent pas')
                .setThumbnail(linkImage)
                .addFields(
                    //{ name: 'Regular field title', value: 'Some value here' },
                   
{ name: '\u200B', value: '\u200B' },
                   
{ name: 'Joueurs', value: joueursNames, inline: true },
                   
{ name: 'Rôles', value: rolesString, inline: true },
                   
{ name: '\u200B', value: '\u200B' },
                )
                //.addField('Inline field title', 'Some value here', false)
                //.setImage('https://i.imgur.com/m3SG4PB.png')
                .setTimestamp()
                .setFooter('One night Lg', linkImage);

            message.channel.send(messageEmbed);
        }
        
    }
    else
{
        message.channel.send("Une partie doit être en cours pour pouvoir entamer la nuit");
    }

};

module.exports.help = CONSTANTES.COMMANDS.GAME.START;