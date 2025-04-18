const
{ rolesAction, rolesInfos, CONSTANTES.GAME_CHANNEL_NAME, CONSTANTES.ERRORS_CHANNEL_NAME } =  require("./config.js");
const
{ CONSTANTES.PREFIX } = require("./config.js");


class Joueur
{
    constructor(auteur, i, guildId)
{
        this.channel = auteur;
        this.name = auteur.username;
        this.tag = auteur.tag;
        this.id = auteur.id;
        this.guildId = guildId;

        this.nomPartage = false;
        this.indiceInit = i;

        this.actionStr = [false];
        this.aJoue = false;
        this.jouant = false;

        this.vote = false;
        this.nbVotes = 0;
        
        this.roleInit = false;
        this.roleFin = false;
        this.roleAction = false;
    }

    enroler (roleInit)
{
        this.roleInit = roleInit;
        this.roleAction = roleInit;
        this.roleFin = roleInit;

        if (roleInit === "stop")
{
            this.channel.createDM().then(channel =>
{
                channel.send (`La partie a été arrêtée`);
            }).catch()
        }
        else if (roleInit === "reinit")
{
            this.channel.createDM().then(channel =>
{
                channel.send (`La partie a été supprimée`);
            }).catch()

        }
        else
{
            this.channel.createDM().then(channel =>
{
                channel.send (`Votre rôle est : ${roleInit}`);
            }).catch()
        }
        
    }

    

    joue(bot, guildId, i, indiceJ, temps)
{
        if (! bot.parties.get(guildId ).has("preparationFinie") ) return;
        var joueurs = bot.joueurs.get(guildId);
        const roleCommand = bot.rolesCommands.get( joueurs[indiceJ].roleAction.toLowerCase() );

        if (this.actionStr[this.actionStr.length -1] === false)
{

            this.channel.createDM().then(channel =>
{
                
                const filter = m => (m.content.startsWith(`${CONSTANTES.PREFIX}action`)  && roleCommand.actionLegale( bot, guildId,indiceJ, joueurs, m.content.slice( CONSTANTES.PREFIX.length + 7)) || m.content === `${CONSTANTES.PREFIX}La partie a été arrêtée` || m.content === `${CONSTANTES.PREFIX}La partie a été supprimée` )  ;
                channel.awaitMessages(filter,
{ max: 1, time: 5*60000, errors: ['time'] })
                        .then(collected =>
{
                                            if (! (collected.first().content === `${CONSTANTES.PREFIX}La partie a été arrêtée` || collected.first().content === `${CONSTANTES.PREFIX}La partie a été supprimée`))
{
                                                //channel.send(`Votre commande ${collected.first().content.slice(6)} a été pris en compte`);
                                                //var joueurs = bot.joueurs.get(guildId); 
                                                var joueurs = bot.joueur.get (collected.first().author.id);
                                                
                                                
                                                joueurs[indiceJ].actionStr[ joueurs[indiceJ].actionStr.length -1 ] = collected.first().content.slice( CONSTANTES.PREFIX.length + 7) ;
                                                
                                                const commandRole = joueurs[indiceJ].roleAction.toLowerCase();
                                                const command = bot.rolesCommands.get(commandRole);


                                                command.action ( bot, guildId, indiceJ, joueurs ); 
                                                
                                                
                                                if (joueurs[indiceJ].aJoue || joueurs[indiceJ].roleInit.toLowerCase() === "doppleganger" ){
                                                    if (joueurs[indiceJ].aJoue){
                                                        joueurs[indiceJ].channel.createDM().then(channel =>
{
                                                            channel.send("Félicitations ! Vous avez fini de jouer !!");
                                                        })
                                                    }
                                                    else
{
                                                        /*joueurs.shift();
                                                        console.log(joueurs);*/
                                                    }
                                                    deroulementNuit(bot, guildId, i+1, temps, false);
                                                }
                                                else
{
                                                    joueurs[indiceJ].joue(bot, guildId, i, indiceJ, temps);
                                                }
                                            }
                                                
                                            
                                            })
                                                    
                        .catch(collected =>
{//erreurChannel.send(`Après 5 minutes, ${joueurs[indiceJ].name} didn't play (ou alors y a problem)`);
                                            joueurs[indiceJ].channel.createDM().then (channel =>
{
                                                channel.send("Vous n'avez pas joué après 5 minutes, votre tour a été passé");
                                            })
                                            joueurs[indiceJ].aJoue = true;
                                            deroulementNuit(bot, guildId, i+1, temps, false);
                                            });

            }).catch () //error =>
{erreurChannel.send ("Envoyer un message privé est impossible")})

        }
            
        else
{ // le joueur a joué en avance
            if ( !partie.has("preparationFinie") ) return;
            const command = bot.rolesCommands.get(this.roleAction);
            if ( command.actionLegale(bot, guildId, indiceJ, joueurs, this.actionStr[ this.actionStr.length -1 ] ) , this.messageAction)
{
                command.action(bot, guildId, indiceJ, joueurs);
                if (this.aJoue === true)
{ 
                    deroulementNuit(bot, guildId, i+1, temps, false);
                } 
                else
{
                    this.joue(bot, guildId, i, indiceJ, temps);
                }
            }
            else
{
                if ( !partie.has("preparationFinie") ) return;
                
                this.channel.createDM().then( channel =>
{
                    channel.send("Votre action n'est plus légale veuillez rejouer");
                }).catch()
                this.actionStr [this.actionStr.length -1] = false;
            }
        }    
    }
}

function isActionLG(role, joueurs)
{
        
    var roleDebut = role.split("-")[0].toLowerCase();
    if (roleDebut === "loup"){
        var nbLg = 0;
        for (var i = 0; i < joueurs.length; i ++)
{
            var roleJDebut = joueurs[i].roleAction.split("-")[0].toLowerCase();
            if (roleJDebut === "loup")
{
                nbLg +=1;
            }
        }
        if (nbLg ===1){
            return true;
        }
    }
    return false;
}


function shuffle(sourceArray)
{
    for (var i = 0; i < sourceArray.length - 1; i++)
{
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}



function debutNuit( bot, guildId)
{
    
    var partie = bot.parties.get( guildId);
    partie.set("preparationFinie", true);

    var rolesJeu = partie.get("rolesJeu");
    partie.set("rolesJoues", new Array());
    partie.set("rolesCentre", new Array());

    var rolesJoues = partie.get("rolesJoues");
    var rolesCentre = partie.get("rolesCentre");

    var joueurs = bot.joueurs.get (guildId);

    shuffle (joueurs) ;

    const a = Math.floor(Math.random() * ( rolesJeu.length )) ;
    var b = Math.floor(Math.random() * ( rolesJeu.length ));
    while (b ===a)
{
        var b = Math.floor(Math.random() * ( rolesJeu.length ));
    }
    var c = Math.floor(Math.random() * ( rolesJeu.length ));
    while ((c ===a) || (c ===b))
{
        var c = Math.floor(Math.random() * ( rolesJeu.length ));
    }


    //this.channel.send(`${a} ${b} ${c}`);
        
        
    for (var j = 0; j < rolesJeu.length; j ++)
{
        if (j === a)
{
            rolesCentre.push( rolesJeu[j] );
        }
        else
{
            if (j=== b)
{
                rolesCentre.push( rolesJeu[j] );
            }
            else
{
                if (j ===c )
{
                    rolesCentre.push( rolesJeu[j] );
                }
                else
{
                    rolesJoues.push( rolesJeu[j] );
                }
            }
        }
    }
    for (var j = 0; j < rolesJoues.length; j++)
{
        joueurs[j].enroler( rolesJoues[j]);
    }

    //verification();

    var temps = 0;
    deroulementNuit (bot, guildId, 0, temps, false); 
}


const
{ rolesAJouerCherche } = require ("./fonctions/cherche");

function deroulementNuit (bot, guildId, i, temps, boolActionCentrePrec)
{
    
    var partie = bot.parties.get( guildId);
    
    if ( !partie.has("preparationFinie") ) return;

    const rolesJoues = partie.get("rolesJoues");
    
    if (boolActionCentrePrec === true)
{
        temps = temps + Math.floor(Math.random() * 5000) + 5000;
    }

    if (i === rolesJoues.length + 3){

        setTimeout( function ()
{
            var partie = bot.parties.get( guildId);
            const channelJeu = bot.channelsJeu.get (guildId).get(CONSTANTES.GAME_CHANNEL_NAME);
            channelJeu.send (`La nuit est finie ! Vous pouvez dès maintenant procéder aux votes `);
            partie.set("nuitFinie", true);
        }, temps);

    }
    
    else{
        
        
        setTimeout( function ()
{

            var partie = bot.parties.get( guildId);
            const rolesJeu = partie.get("rolesJeu");
            const rolesJoues = bot.parties.get(guildId).get("rolesJoues");

            var joueurs = bot.joueurs.get (guildId);


            var indiceJ = rolesAJouerCherche( rolesJeu[i], rolesJoues, joueurs);
            
            const channelJeu = bot.channelsJeu.get (guildId).get(CONSTANTES.GAME_CHANNEL_NAME);  

            channelJeu.send (`C'est au tour du joueur répondant au rôle de ${rolesJeu[i]} de jouer`);

            if (rolesJeu[i].toLowerCase() === "blob")
{
                var nbBlob = new Number()
    
                if (joueurs.length > 4)
{
                    nbBlob = Math.floor(Math.random() * 3);
                }
                else
{
                    nbBlob = Math.floor(Math.random() * 2);
                }
                if (nbBlob === 0)
{
                    channelJeu.send("La personne à gauche du blob (moins 1 dans la liste) a été blobifiée");
                    if (! (indiceJ === false)) joueurs[indiceJ].actionStr = [ (joueurs[indiceJ].indiceInit -1)% joueurs.length ];
                }
                else if (nbBlob === 1)
{
                    channelJeu.send("La personne à votre droite (plus 1 dans la liste) a été blobifiée");
                    if (! (indiceJ === false)) joueurs[indiceJ].actionStr = [ (joueurs[indiceJ].indiceInit +1)% joueurs.length ];
                }
                else
{
                    channelJeu.send("Les personnes à votre droite et votre gauche ont été blobifiées");
                    if (! (indiceJ === false)) joueurs[indiceJ].actionStr = [ (joueurs[indiceJ].indiceInit -1)% joueurs.length, (joueurs[indiceJ].indiceInit +1)% joueurs.length  ];
                    
                }
                deroulementNuit( bot, guildId, i + 1, temps, false );
            }
            else
{
                if (indiceJ === false){ 
                    var boolActionCentre = false;
                    const commandRoleName = rolesJeu[i].toLowerCase();
                    const commandRole = bot.rolesCommands.get(commandRoleName);
                    if ( commandRole.help.typeRole[0].length)
{
                            boolActionCentre = true;
                    }
                    
                    deroulementNuit(bot, guildId, i+1,  temps, boolActionCentre);
                }
                else
{
                    joueurs[indiceJ].jouant = true;
    
                    const commandRoleName = joueurs[indiceJ].roleAction.toLowerCase();
                    
                    if ( !partie.has("preparationFinie") ) return;
                    const commandRole = bot.rolesCommands.get(commandRoleName);
    
                    if (commandRole.help.typeRole[1].length)
{
                        commandRole.envoieInfos (bot, guildId,  indiceJ, joueurs);
                    }
    
                    const channelErreurs = bot.channelsJeu.get(guildId).get( CONSTANTES.ERRORS_CHANNEL_NAME);
    
                    if ( (isActionLG( commandRoleName, joueurs ) || commandRole.help.typeRole[0].length) && !joueurs[indiceJ].aJoue)
{
                        joueurs[indiceJ].channel.createDM().then(channel =>
{    
                            if ( !partie.has("preparationFinie") ) return;
                            channel.send("C'est à vous de jouer");
                            joueurs[indiceJ].joue(bot, guildId, i, indiceJ, temps);
                            
                                
                        }).catch(error =>
{
                            channelErreurs.send(`Le joueur ${joueurs[indiceJ].channel} ne peut pas recevoir de messages privés !!`);
                                    })
                                
                    }
                        
                    else
{
                        deroulementNuit(bot, guildId, i+1, temps, false);
                    }
                }
            }
        }, temps);
        

        


        
    }
}


module.exports =
{
    debutNuit,
    deroulementNuit,
    isActionLG,
    Joueur,
}