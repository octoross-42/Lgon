const
{ Collection } = require("discord.js");
const
{ CONSTANTES } = require ("../../config/constantes.js");

module.exports.run = (bot, message, argsMessage) =>
{

    if (! (bot.channelsJeu.has (message.channel.guild.id)))
	{
        var serveurs = new Collection();
    }
    else
{
        var serveurs = bot.channelsJeu.get(message.channel.guild.id);
    }
    if ( !argsMessage.length )
{
        var channelJeu = message.guild.channels.cache.find(ch => ch.name === CONSTANTES.GAME_CHANNEL_NAME);
        var channelRoles = message.guild.channels.cache.find(ch => ch.name === ROLES_CHANNEL_NAME) ;
        var channelErreurs = message.guild.channels.cache.find(ch => ch.name === CONSTANTES.ERRORS_CHANNEL_NAME);
        if (channelJeu)
			serveurs.set(CONSTANTES.GAME_CHANNEL_NAME, channelJeu);
        if (channelRoles)
			serveurs.set(ROLES_CHANNEL_NAME, channelRoles);
        if (channelErreurs)
			serveurs.set( CONSTANTES.ERRORS_CHANNEL_NAME, channelErreurs);
        
        if (serveurs.get(CONSTANTES.GAME_CHANNEL_NAME)) bot.channelsJeu.set (message.channel.guild.id, serveurs);
    }
    else
{
        
        if (argsMessage[0].toLowerCase() === "jeu")
{
            channelJeu = message.guild.channels.cache.find(ch => ch.id === argsMessage[1]);

            if (! (channelJeu === undefined))
{
                serveurs.set( CONSTANTES.GAME_CHANNEL_NAME , channelJeu);
                bot.channelsJeu.set (message.channel.guild.id, serveurs);
                channelJeu.send("Opération réussie !");
            }
            else
{
                channelJeu.send("Id non reconnue");
            }
        } 
        else if (argsMessage[0].toLowerCase() === "ROLES_DATA")
{
            channelRoles = message.guild.channels.cache.find(ch => ch.id === argsMessage[1]);
            if (! (channelRoles === undefined))
{
                serveurs.set(CONSTANTES.ROLES_CHANNEL_NAME, channelRoles);
                bot.channelsJeu.set (message.channel.guild.id, serveurs);
                channelJeu.send("Opération réussie !");
            }
            else
{
                channelJeu.send("Id non reconnue");
            }
        }
        else if (argsMessage[0].toLowerCase() === "erreurs")
{
            channelErreurs = message.guild.channels.cache.find(ch => ch.id === argsMessage[1]);
            if (! (channelErreurs === undefined))
{
                serveurs.set( CONSTANTES.ERRORS_CHANNEL_NAME, channelErreurs);
                bot.channelsJeu.set (message.channel.guild.id, serveurs);
                channelJeu.send("Opération réussie !");
            }
            else
{
                channelJeu.send("Id non reconnue");
            }
        }

        

        
    }

    

    
};

module.exports.help = CONSTANTES.COMMANDS.BOT.SET_CHANNEL;