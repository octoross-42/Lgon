const
{ CONSTANTES } = require ("../../../config/constantes.js");

module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has( message.channel.guild.id))
	{
        var partie = bot.parties.get( message.channel.guild.id);
        if ( partie.has ("preparationFinie"))
		    partie.delete("preparationFinie");
        if ( partie.has ("nuitFinie"))
            partie.delete( "nuitFinie");

        var joueurs = bot.joueurs.get( message.channel.guild.id);
        for ( var i = 0; i < joueurs.length; i ++ )
            joueurs[i].enroler("stop");
	
        const channelJeu = bot.channelsJeu.get(message.channel.guild.id).get (CONSTANTES.GAME_CHANNEL_NAME);
        channelJeu.send( "La partie a été arrêtée, les paramètres (joueurs et rôles) ont été conservés");
    }
    else
	    await message.channel.send("Une partie doit être en cours pour pouvoir la stopper");

};

module.exports.help = CONSTANTES.COMMANDS.GAME.STOP;