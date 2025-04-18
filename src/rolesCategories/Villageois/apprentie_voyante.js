const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ unJoueurCherche } = require ("./fonctions/cherche.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{
}

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);
    const bool = ( (!( indiceJA === false ) && !(indiceJA === indiceJ)) || (actionStr === "gauche" || actionStr === "milieu" || actionStr === "droite") );
    if  (!bool)
{
        joueurs[indiceJ].channel.send("Action pas légale");
        return false;
    } 
    return true;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    var messageAEnvoyer = new String();
    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];

    if ( actionStr === "gauche") messageAEnvoyer = `Le rôle est : ${rolesCentre[0]}` ;
    else if ( actionStr === "milieu") messageAEnvoyer = `Le rôle est : ${rolesCentre[1]}` ;
    else if ( actionStr === "droite") messageAEnvoyer = `Le rôle est : ${rolesCentre[2]}` ;
    else
{
        const indiceJA = unJoueurCherche(actionStr, joueurs);
        messageAEnvoyer = `Son rôle est : ${joueurs[indiceJA].roleFin}` ;
    }

    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(messageAEnvoyer);
    })
    joueurs[indiceJ].aJoue = true;

    return joueurs;

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.APPRENTIE_VOYANTE;