const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ unJoueurCherche } = require ("./fonctions/cherche.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{

}

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    if (joueurs[i].actionStr.length === 1 || (joueurs[i].actionStr.length === 2 && joueurs[i].roleInit === "Doppleganger" ))
{
        if ( actionStr.toLowerCase() === "gauche" || actionStr.toLowerCase() === "milieu" || actionStr.toLowerCase() === "droite")
{  //regarde une carte au centre
            return true;
        }
    }
    else
{
        const indiceJA = unJoueurCherche(actionStr, joueurs);
        if (actionStr.toLowerCase() === "rien" || !(indiceJA === false) ){
            return true;
        }
    }
    joueurs[indiceJ].channel.send("Action pas légale");
    return false;
}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];
    var rolesCentre = bot.parties.get(guildId).get("rolesCentre");

    var messageAEnvoyer = new String();

    if (actionStr.toLowerCase() === "gauche")
{
        messageAEnvoyer = `Le rôle est ${rolesCentre[0]} \n Que voulez-vous faire de ce rôle ?`;

    }
    else if (actionStr.toLowerCase() === "milieu")
{
        messageAEnvoyer = `Le rôle est ${rolesCentre[1]}\n Que voulez-vous faire de ce rôle ?`;

    }
    else if (actionStr.toLowerCase() === "droite")
{
        messageAEnvoyer = `Le rôle est ${rolesCentre[2]}\n Que voulez-vous faire de ce rôle ?`;

    }
    else if (actionStr.toLowerCase() === "rien")
{
        messageAEnvoyer = `Le rôle reste donc à sa place`;
        joueurs[indiceJ].aJoue = true;
    }
    else
{
        joueurs[indiceJ].aJoue = true;
        const indiceJA = unJoueurCherche(actionStr, joueurs);

        const centreStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -2];
        var indiceC = false;

        if (centreStr.toLowerCase() === "gauche")
{
            indiceC = 0;
        }
        else if (centreStr.toLowerCase() === "milieu")
{
            indiceC = 1;
        }
        else
{
            indiceC = 2;

        }

        const rolePassage = joueurs[indiceJA].roleFin;
        joueurs[indiceJA].roleFin = rolesCentre [indiceC] ;
        rolesCentre [indiceC] = rolePassage;

        if ( indiceJA === indiceJ)
{
            messageAEnvoyer = `Le rôle ${joueurs[indiceJA].roleFin } vous a été attribué`;
        }
        else
{
            messageAEnvoyer = `Le rôle ${joueurs[indiceJA].roleFin } a été attribué à ${joueurs[indiceJA].name}`;
        }

    }
    
    
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(messageAEnvoyer);
    })

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.SORCIERE;