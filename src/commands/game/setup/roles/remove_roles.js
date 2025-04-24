const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ MIN_NBR_PLAYERS, ROLES_DATA } = require ("./config.js");
const
{ verificationDebutNuit } = require ("./fonctions/verificationDebutNuit.js");
const
{ enleve } = require ("./fonctions/enleve.js");

module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has(message.guild.id)  && !(bot.parties.get(message.guild.id) === false))
{ 
        const nbRole = parseInt(argsMessage[0]);

        if (nbRole === NaN || argsMessage.length === 1)
{
            
            const remove = bot.commands.get("remove_roles");
            argsMessage.unshift("1");
            return remove.run(bot, message, argsMessage);
            
        }

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
                var nbRolePresent = 0;
                for (var i = 0; i < rolesJeu.length; i++)
{
                    if (rolesJeu[i].toLowerCase() === beauRole.toLowerCase())
{
                        nbRolePresent += 1;
                    }
                }

                rolesJeu = enleve( beauRole, rolesJeu);
                for (var i = 0; i < Math.max (0, nbRolePresent - nbRole) ; i ++ )
{
                    rolesJeu.push(beauRole);
                }
                    
    
            }
            i +=1;
        }
        if (boolR)
{
            if ( Math.min (nbRole, nbRolePresent) >= 1 )
{
                await message.channel.send(`${Math.min (nbRole, nbRolePresent)} ${beauRole} a été enlevé à la composition`);
            }
            else
{
                await message.channel.send(`${Math.min (nbRole, nbRolePresent)} ${beauRole} ont été enlevés à la composition`);
            }

            const joueurs = bot.joueurs.get( message.guild.id );
            if (joueurs.length + 3 === rolesJeu.length && joueurs.length >= MIN_NBR_PLAYERS )
{
                verificationDebutNuit(bot, message.guild.id, message.channel);
            }
        }
    }
    else
{
        await message.channel.send( "Il faut qu'une partie soit commencée pour enlever des rôles ");
    }

}

module.exports.help = CONSTANTES.COMMANDS.ROLES_DATA.REMOVE_ROLES;