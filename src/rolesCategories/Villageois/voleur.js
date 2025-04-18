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
    const bool = ( !( indiceJA === false ) && !(indiceJA === indiceJ) );
    if (bool) return true;
    joueurs[indiceJ].channel.send("Action pas légale");
    return false;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    const indiceJA = unJoueurCherche(actionStr, joueurs);

    const rolePassage = joueurs[indiceJA].roleFin;
    joueurs[indiceJA].roleFin = joueurs[indiceJ].roleFin;
    joueurs[indiceJ].roleFin = rolePassage;

    joueurs[indiceJ].aJoue = true;
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(`Vous avez volé ${joueurs[indiceJA].name} qui était ${joueurs[indiceJ].roleFin}`);
    })

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.VOLEUR;