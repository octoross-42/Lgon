const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ MIN_NBR_PLAYERS } = require ("./config.js");
const
{ verificationDebutNuit } = require ("./fonctions/verificationDebutNuit.js");
const
{ trie } = require ("./fonctions/enleve.js");

module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has(message.guild.id)  && !(bot.parties.get(message.guild.id) === false))
{ 
        const nbRole = parseInt(argsMessage[0]);

        if (nbRole === NaN || argsMessage.length === 1)
{
            const add = bot.commands.get("add_roles");
            argsMessage.unshift("1");
            return add.run(bot, message, argsMessage);
            
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

            const commandRole = bot.rolesCommands.get(role.toLowerCase()) || bot.rolesCommands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(role.toLowerCase()));

            if (commandRole)
{
                role = commandRole.help.name;
                var beauRole = new Array();
                const roleEspaces = role.split(" ");
                for (var i = 0; i < roleEspaces.length; i ++ )
{
                    beauRole.push( `${roleEspaces[i][0].toUpperCase()}${roleEspaces[i].slice(1, roleEspaces[i].length).toLowerCase()}`);
                }
                beauRole = beauRole.join(" ");
                boolR = true;
                for (var i = 0; i < nbRole; i ++ )
{
                    rolesJeu.push(beauRole);
                }
                rolesJeu = trie(rolesJeu);
                bot.parties.get(message.guild.id).set("rolesJeu", rolesJeu);

    
            }
            i +=1;
        }
        if (boolR)
{
            if (nbRole >= 1)
{
                message.channel.send(`${nbRole} ${beauRole} a été ajouté à la composition`);
            }
            else
{
                message.channel.send(`${nbRole} ${beauRole} ont été ajoutés à la composition`);
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
        message.channel.send( "Il faut qu'une partie soit commencée pour ajouter des rôles ");
    }

}

module.exports.help = CONSTANTES.COMMANDS.ROLES_DATA.ADD_ROLES;