const
{ Joueur } = require("./fonctions/nuit.js");
const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ verificationDebutNuit } =  require("./fonctions/verificationDebutNuit.js");
const
{ joueurCherche } = require ("./fonctions/cherche.js");

module.exports.run = (bot, message, argsMessage) =>
{

    if (bot.parties.has(message.guild.id)  && !(bot.parties.get(message.guild.id) === false))
{   // si une partie est lancée sur le serveur
        var joueurs = bot.joueurs.get(message.guild.id);
        var boolJ = false;

        var joueurBool = bot.joueur.has(message.author.id); // le joueur joue quelque part
        if (joueurBool)
{
            var boolJ = true;

            var boolSurLeServeur = false;
            for (var i = 0; i < joueurs.length; i++)
{
                if (joueurs[i].guildId === message.channel.guild.id)
{
                    message.author.createDM().then( channel =>
{
                        channel.send("Vous jouez déjà...");
                    }).catch();
                    boolSurLeServeur = true;
                    break;
                }
            }
            if (!boolSurLeServeur)
{
                message.author.createDM().then( channel =>
{
                    channel.send("Vous jouez déjà sur un autre serveur...");
                }).catch();
            }
        }

        if (!boolJ)
{
            const partie = bot.parties.get(message.guild.id);

            if (partie.has( "preparationFinie" ))
{
                message.author.createDM().then( channel =>
{
                    channel.send("La nuit a déjà commencée, vous ne pouvez pas vous ajouter à la partie !");
                }).catch();
            }
        
            else
{ 
                message.author.createDM().then( channel =>
{
                    channel.send("Vous jouez ! Veuillez checker vos mps durant la nuit !");
                }).catch();
                
                
                joueurs.push( new Joueur (message.author, joueurs.length, message.channel.guild.id));

                for (var i = 0; i < joueurs.length; i++)
{
                    bot.joueur.set (joueurs[i].id, joueurs);
                }

                var personnesANotifier = new Array();
                var boolUniqueJ = true;
                for (var i = 0; i < joueurs.length -1 ; i++ )
{
                    const name1 = joueurs[i].name.split("#")[0];
                    const name2 = joueurs[joueurs.length -1].name.split("#")[0];
                    
                    if (name1 === name2)
{
                        personnesANotifier.push(i);
                        boolUniqueJ = false;
                    }
                }
                if (!boolUniqueJ && personnesANotifier.length)
{
                    joueurs[joueurs.length -1].channel.createDM().then( channel =>
{
                        channel.send("Vous partagez votre nom avec d'autre(s) joueur(s), on vous mentionnera à partir de maintenant par votre nom et tag");
                    }).catch();
                    joueurs[joueurs.length -1].nomPartage = true;
                    joueurs[joueurs.length -1].name = joueurs[joueurs.length -1].tag;

                    for (var i = 0; i < personnesANotifier.length; i ++){
                        if (joueurs[ personnesANotifier[i] ].nomPartage === false )
{
                            joueurs[ personnesANotifier[i] ].channel.createDM().then( channel =>
{
                                channel.send("Vous partagez votre nom avec d'autre(s) joueur(s), on vous mentionnera à partir de maintenant par votre nom et tag");
                            }).catch();
                            joueurs[ personnesANotifier[i] ].name = joueurs[ personnesANotifier[i] ].tag;
                            joueurs[ personnesANotifier[i] ].nomPartage = true ;


                        }
                    }
                        
                }


                

                if (partie.has ("rolesJeu"))
{
                    const rolesJeu = partie.get("rolesJeu")
                    if (joueurs.length + 3 === rolesJeu.length)
{
                        verificationDebutNuit(bot, message.guild.id, message.channel);
                    }
                }
            }
        }
                        
        
    }
    else
{
        const commandPartie = bot.commands.get("create_partie");
        commandPartie.run (bot, message, argsMessage);
        if (bot.parties.has(message.guild.id))
{
            const commandJoue = bot.commands.get("joue");
            commandJoue.run (bot, message, argsMessage);
        }
        else
{
            message.channel.send(`Une partie doit être commencée pour y jouer`);
        }
    }
        
   
}

module.exports.help = CONSTANTES.COMMANDS.PLAYERS_DATA.JOUE;