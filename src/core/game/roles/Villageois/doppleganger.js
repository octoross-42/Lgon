const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ unJoueurCherche } = require ("./fonctions/cherche.js");
const
{ isActionLG } = require ("./fonctions/nuit.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{
}

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    const bool = ( (!( indiceJA === false ) && !(indiceJA === indiceJ)) );
    if (! bool)
{
        joueurs[indiceJ].channel.send("Action pas légale");
        return false;
    }
    return true;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{

    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];
    
    const indiceJA = unJoueurCherche(actionStr, joueurs);

    var messageAEnvoyer = new String();

    joueurs[indiceJ].roleAction = joueurs[indiceJA].roleInit;    
    messageAEnvoyer = `La personne que vous avez dopplegangé est : ${joueurs[indiceJA].roleInit}`; 

    const commandRoleJA =  bot.rolesCommands.get(joueurs[indiceJA].roleInit.toLowerCase());
    
    if ( ( isActionLG(joueurs[indiceJA].roleInit, joueurs)  || commandRoleJA.typeRole[0].length ) && !(joueurs[indiceJA].roleInit === "Doppleganger"))
{

        var rolesJeu = bot.parties.get(guildId).get("rolesJeu");
        messageAEnvoyer = `${messageAEnvoyer} \nVeuillez jouer votre rôle juste après la personne que vous avez dopplegangé (vous serez notifié)`;
        joueurs[indiceJ].actionStr.push(false);

        joueurs[indiceJ].channel.createDM().then(channel =>
{
            channel.send(messageAEnvoyer);
        })

        /*var nbRoleJoues = 0;
        var indice = false;
        var rolesJoues = bot.parties.get(guildId).get("rolesJoues");
        for (var j = 0; j < rolesJoues.length; j++)
{
            if (joueurs[indiceJA].roleInit.toLowerCase() === rolesJoues[j].toLowerCase() )
{
                nbRoleJoues ++;
                indice = j;
            }
        }
        rolesJoues.shift();
        rolesJoues.splice( indice, 0,joueurs[indiceJA].roleInit );
        const joueur = joueurs[indiceJ];

        joueurs.splice(indice + 1, 0 , joueur);        */
    }

    else
{
        joueurs[indiceJ].aJoue = true;  
        joueurs[indiceJ].channel.createDM().then(channel =>
{
            channel.send(messageAEnvoyer);
        })
        
    }

    

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.DOPPLEGANGER;