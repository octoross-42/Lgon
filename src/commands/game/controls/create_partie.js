const
{ CONSTANTES } = require ("../../../config/constantes.js");
const
{ Collection } = require("discord.js");


module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has(message.guild.id) && !(bot.parties.get(message.guild.id) === false))
        message.channel.send("Une partie est déjà lancée sur ce serveur...");
    else
	{
        var partie = new Collection();
        partie.set("rolesJeu", new Array());
        
        bot.parties.set( message.guild.id, partie );
        bot.joueurs.set( message.guild.id, new Array() );

        message.channel.send(`La partie va commencer ! Veuillez indiquer que vous jouer avec la commande \`${CONSTANTES.PREFIX}joue\` !`);   
    }
};

module.exports.help = CONSTANTES.COMMANDS.GAME.CREATE_PARTIE;