const
{ CONSTANTES } = require ("../../../../config/constantes.js");
const
{ joueurCherche } = require ("./fonctions/cherche.js");
const
{ isActionLG } = require ("./fonctions/nuit.js");


module.exports.run = (bot, message, argsMessage) =>
{
    if (!argsMessage.length)
{
        const help = bot.commands.get("help");
        help.run(bot, message, ["action"] );
    }

    else
{
        const joueurs = bot.joueur.get(message.author.id);
        if (!message.guild )
{ 
            const joueurs = bot.joueur.get(message.author.id);
            const indiceJ = joueurCherche (message.author.tag, joueurs);
            if (joueurs[indiceJ].jouant === false )
{
                if ( isActionLG( joueurs[indiceJ].roleAction, joueurs ) || bot.rolesCommands.get(joueurs[indiceJ].roleAction.toLowerCase()).typeRole.length  )
{
                    const commandRole = bot.rolesCommands.get ( joueurs[indiceJ].roleAction.toLowerCase() );
                    if (commandRole.actionLegale( bot, joueurs[0].guildId , indiceJ, joueurs, message.content.slice( CONSTANTES.PREFIX.length + 7) ))
{
                        joueurs[indiceJ].actionStr [joueurs[indiceJ].actionStr.length -1] = message.content.slice( CONSTANTES.PREFIX.length + 7);
                        message.react("👍");                    
                    }
                    else
{
                        message.react("👎");
                        message.channel.send("Action pas légale : c'est moche ça");
                    }
                }
            }
            
            
        }
    }

    
}

module.exports.help = CONSTANTES.COMMANDS.PLAYERS_DATA.ACTION;