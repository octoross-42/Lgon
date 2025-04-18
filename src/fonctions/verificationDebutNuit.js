const
{ CONSTANTES.GAME_CHANNEL_NAME} =  require("./config.js");
const
{MessageEmbed} = require('discord.js');
const
{ debutNuit } = require ("./fonctions/nuit.js");


function verificationDebutNuit (bot, guildId, messageChannel)
{
    
    const rolesJeu = bot.parties.get(guildId).get("rolesJeu");
    const joueurs = bot.joueurs.get(guildId);


    var serveurChannels = bot.channelsJeu.get(guildId);
    var channelJeu = serveurChannels.get(CONSTANTES.GAME_CHANNEL_NAME);
    if (channelJeu === undefined)
{
        channelJeu = messageChannel;
        channelJeu.send("La partie se déroulera ici");
        bot.channelsJeu.set(guildId, serveurChannels.set(CONSTANTES.GAME_CHANNEL_NAME, channelJeu));
    }

    var joueursNames = new String();

    joueursNames = `1. ${joueurs[0].name}`;
    

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
        .setTitle('Partie')

        .setDescription('Réagir pour commencer (ou pas) la partie')
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

    channelJeu.send(messageEmbed).then(sentMessage =>
{
            sentMessage.react("✅");
            sentMessage.react("❌");
            const filter = (reaction, user) =>
{
                return ['✅', '❌'].includes(reaction.emoji.name) && user.bot === false}
            sentMessage.awaitReactions(filter,
{ max: 1, time: 3*60000, errors: ['time'] })
                .then(collected =>
{
                    const reaction = collected.first();
        
                    if (reaction.emoji.name === '✅')
{
                        sentMessage.channel.send('La nuit va pouvoir commencer, chaque joueur reçoit son rôle ! \n');
                        debutNuit ( bot, guildId);
    
                    } 
                    else if (reaction.emoji.name === '❌')
{
                        sentMessage.channel.send('Les paramètres sont conservés, vous pouvez changer les rôles (en réagissant 0 pour enlever des rôles sélectionnés) ou vous enlever de la partie avec \`dejoue\`');
                    }
            })
            //.catch(collected =>
{
            //    sentMessage.reply("Il fallait réagir en moins de 3 minutes, ce message n'est plus valide ");
            //});
    })

    
}

module.exports =
{
    verificationDebutNuit,
}