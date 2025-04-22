const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ MIN_NBR_PLAYERS } = require ("./config.js");
const
{ verificationDebutNuit } = require ("./fonctions/verificationDebutNuit.js");
const
{ enleve } = require ("./fonctions/enleve.js");

module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has(message.guild.id)  && !(bot.parties.get(message.guild.id) === false))
{ 
        const nbRole = parseInt(argsMessage[0]);

        if (nbRole == NaN) return ;

        var role = argsMessage [1].toLowerCase();
        var rolesJeu = bot.parties.get(message.guild.id).get("rolesJeu");
        var boolR = false;
        var i = 1;

        
        while ( !boolR && i < argsMessage.length)
{ // les espaces c'est chiant....
            role = argsMessage[1];
            for (var j = 1; j < i; j++ )
{
                role = `${role} ${argsMessage[j+1]}`;
            } 

            const commandRole = bot.rolesCommands.get(role.toLowerCase()) || bot.rolesCommands.find(cmd => cmd.aliases && cmd.aliases.includes(role.toLowerCase()));

            if (commandRole)
{
                role = commandRole.name;
                var beauRole = new Array();
                const roleEspaces = role.split(" ");
                for (var i = 0; i < roleEspaces.length; i ++ )
{
                    beauRole.push( `${roleEspaces[i][0].toUpperCase()}${roleEspaces[i].slice(1, roleEspaces[i].length).toLowerCase()}`);
                }
                beauRole = beauRole.join(" ");
                boolR = true;
                rolesJeu = enleve( beauRole, rolesJeu);
                for (var i = 0; i < nbRole; i ++ )
{
                    rolesJeu.push(beauRole);
                }
                    
    
            }
            i +=1;
        }
        if (boolR)
{
            message.channel.send(`Les ${beauRole} sont maintenant au nombre de ${nbRole}`);

            const joueurs = bot.joueurs.get( message.guild.id );
            if (joueurs.length + 3 === rolesJeu.length && joueurs.length >= MIN_NBR_PLAYERS )
{
                verificationDebutNuit(bot, message.guild.id, message.channel);
            }
        }
    }
    else
{
        message.channel.send( "Il faut qu'une partie soit commencée pour fixer des rôles ");
    }

}

module.exports.help = CONSTANTES.COMMANDS.ROLES_DATA.SET_ROLES;