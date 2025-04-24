const
{ CONSTANTES } = require ("../../../config/constantes.js");

module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has( message.channel.guild.id))
{
        bot.parties.delete( message.channel.guild.id);


        var joueurs = bot.joueurs.get( message.channel.guild.id);
        for ( var i = 0; i < joueurs.length; i ++ )
{
            joueurs[i].enroler("reinit");
        }
        
        bot.joueurs.delete( message.channel.guild.id);

        
        const channelJeu = bot.channelsJeu.get(message.channel.guild.id).get(CONSTANTES.GAME_CHANNEL_NAME);
        channelJeu.send( "La partie a été réinitialisée, les paramètres (joueurs et rôles) ont été effacés");
    }
    else
{
        await message.channel.send("Une partie doit être en cours pour pouvoir la réinitialiser");
    }

};

module.exports.help = CONSTANTES.COMMANDS.GAME.REINIT;