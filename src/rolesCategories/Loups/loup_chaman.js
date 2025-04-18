const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ unJoueurCherche, trouveLG } = require ("./fonctions/cherche.js");
const
{ isActionLG } = require ("./fonctions/nuit.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{
    var loups = trouveLG( joueurs );

    var messageAEnvoyer = new String();

    if (loups.length === 1)
{
        messageAEnvoyer = `Vous êtes seul...😓 Vous pouvez regarder une carte au centre pour noyer votre tristesse`; 
    }

    else if (loups.length === 2)
{ // toi et une autre personne
        if (indiceJ === loups[0]){
            messageAEnvoyer = `Le loup avec toi est : ${joueurs[loups[1]].name}`;
        }
        else
{
            messageAEnvoyer = `Le loup avec toi est : ${joueurs[loups[0]].name}`;
        }

        joueurs[indiceJ].aJoue = true;
    }
    
    else
{
        joueurs[indiceJ].aJoue = true;
        messageAEnvoyer = "Les loups avec toi sont : ";
        for (var i = 0; i < loups.length -1 ; i++){
            if (! (i ===  indiceJ)){    // les loups avec toi ne sont pas toi
                if (indiceJ === loups[loups.length -1])
{ // si tu es à la fin
                    if (i === loups.length -3){
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name} et ${ joueurs[loups[i + 1]].name}`;
                        break;
                    }
                    else
{
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name}, `;
                    }
                }
                else if (indiceJ === loups[loups.length -2])
{ // si tu es à la fin mais presque
                    if (i === loups.length -3){
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name} et ${ joueurs[loups[i + 2 ]].name}`;
                        break;
                    }
                    else
{
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name}, `;
                    }

                }
                else{
                    if (i === loups.length -2){   // si t'es pas à l'arrière t'es à l'avant
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i -2 ]].name} et ${ joueurs[loups[i -1]].name}`;
                    }
                    else
{
                        messageAEnvoyer = `${messageAEnvoyer}${ joueurs[loups[i]].name}, `;
                    }
                }
            }
        }
    }                

    joueurs[indiceJ].channel.createDM().then ( channel =>
{
        channel.send(messageAEnvoyer);

    })
}

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);

    if ( !(indiceJA === false) && !(indiceJ === indiceJA)  && !(trouveLG(joueurs).includes(indiceJA)) ) 
{ //contamine une autre personne que les Loups qu'il connait
        if ( joueurs[indiceJ].actionStr[ 0 ]  === false ) return true;
        else
{
            const actionStrPrec = joueurs[indiceJ].actionStr[ 0 ];
            const indiceJAPrec = unJoueurCherche(actionStrPrec, joueurs);
            if ( indiceJAPrec === false) return true;
            joueurs[i].channel.send("Action pas légale");
            return false;
        }
    }
    else if (isActionLG("Loup-alpha", joueurs) && ( actionStr === "gauche" || actionStr === "milieu" || actionStr === "droite"))
{
        if ( joueurs[indiceJ].actionStr[ 0 ]  === false ) return true;
        else
{
            const actionPrec = joueurs[indiceJ].actionStr[ 0 ];
            const centreBoolJAPrec = ( actionPrec === "gauche" || actionPrec === "milieu" || actionPrec === "droite");
            if ( centreBoolJAPrec === false ) return true;
            joueurs[i].channel.send("Action pas légale");
            return false;
        }
    }

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const actionStr = joueurs[indiceJ].actionStr [joueurs[indiceJ].actionStr.length -1 ];
    const indiceJA = unJoueurCherche(actionStr, joueurs);

    const rolesCentre = bot.parties.get(guildId).get('rolesCentre');
    const loups = trouveLG( joueurs );
    var messageAEnvoyer = new String ();

    if (loups.length  === 1 )
{
        if (!(indiceJA === false))
{
            joueurs[indiceJA].roleFin = "Loup-garou";
            messageAEnvoyer = `Son rôle est ${joueurs[indiceJA].roleFin}`;
        }
        else if ( actionStr === "gauche" )
{
            messageAEnvoyer = `Le rôle est : ${rolesCentre[0]}`;
        }
        else if (actionStr === "milieu")
{
            messageAEnvoyer = `Le rôle est : ${rolesCentre[1]}`;
        }
        else if ( actionStr === "droite" )
{
            messageAEnvoyer = `Le rôle est : ${rolesCentre[2]}`;
        }

        
        if (joueurs[indiceJ].actionStr.length ===1)
{
            joueurs[indiceJ].actionStr.push(false);

            messageAEnvoyer = `${messageAEnvoyer} \n Veuillez jouer votre autre action`;
        }
        
        else if ( joueurs[indiceJ].actionStr.length === 2 )
{
            if (joueurs[indiceJ].roleInit === "Doppleganger")
{
                joueurs[indiceJ].actionStr.push(false);
                messageAEnvoyer = `${messageAEnvoyer} \n Veuillez jouer votre autre action`;
            }
            else
{
                joueurs[indiceJ].aJoue = true;
            }
        }
        else
{
            joueurs[indiceJ].aJoue = true;
        }
    }

    else
{
        joueurs[indiceJA].roleFin = "Loup-garou";
        messageAEnvoyer = `Son rôle est ${joueurs[indiceJA].roleFin}`;
        joueurs[indiceJ].aJoue = true;
        
    }
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(messageAEnvoyer);
    })
} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.LOUPS.LOUP_CHAMAN;