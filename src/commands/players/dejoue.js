const
{ CONSTANTES } = require ("../../config/constantes.js");


module.exports.run = (bot, message, argsMessage) =>
{
    if (bot.parties.has(message.guild.id)  && !(bot.parties.get(message.guild.id) === false))
{   // si une partie est lancée sur le serveur
        var joueurs = bot.joueurs.get(message.guild.id);
        

        if (bot.parties.get(message.guild.id).has( "preparationFinie" ))
{
            message.author.createDM().then( channel =>
{
                channel.send("La nuit a déjà commencée, si vous pouvez vous enlever de la partie qu'en l'arrêtant (\`lg stop partie\`");
            }).catch();
        }
        else
{
            var boolJ = false;
            for (var i = 0; i < joueurs.length; i++)
{
                if (joueurs[i].id === message.author.id)
{
                    boolJ = true;

                    joueurs[i].guildId = false;

                    message.author.createDM().then( channel =>
{
                        channel.send("Vous ne jouez plus...");
                    }).catch();


                    if (joueurs[i].nomPartage)
{
                        const name1 = joueurs[i].name.split("#")[0];
                        joueurs.splice(i, 1);

                        var nbNomUnique = 0;
                        var indice = false;
                        for (var i = 0; i < joueurs.length ; i++ )
{
                            const name2 = joueurs[i].name.split("#")[0];
                            if (name1 === name2)
{
                                nbNomUnique += 1;
                                indice = i;
                            }
                        }
                        if (nbNomUnique === 1){
                            joueurs[indice].channel.createDM().then( channel =>
{
                                channel.send("Vous avez l'honneur de retourver l'unicité de votre nom");
                            })
                            joueurs[indice].name = name1;
                            joueurs[indice].nomPartage = false;

                        }
                    }
                    else
{
                        joueurs.splice(i, 1);
                    }
                    for (var i = 0; i < joueurs.length; i++)
{
                        bot.joueur.set (joueurs[i].id, joueurs);
                    }
    
                    
                    break;
                }
                const partie = bot.parties.get(message.channel.guild.id); 
                if (partie.has ("rolesJeu"))
{
                    const rolesJeu = partie.get("rolesJeu")
                    if (joueurs.length + 3 === rolesJeu.length)
{
                        verificationDebutNuit(bot, message.guild.id, message.channel);
                    }
                }
            }

            if (!boolJ)
{
                message.author.createDM().then( channel =>
{
                    channel.send("Vous devez jouer pour ne plus jouer 🤔");
                }).catch();
            }
        }
        
    }
        
    
    
}

module.exports.help = CONSTANTES.COMMANDS.PLAYERS_DATA.DEJOUE;