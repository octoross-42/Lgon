const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ deuxJoueursCherche } = require ("./fonctions/cherche.js");

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    const array = deuxJoueursCherche(actionStr, joueurs);

    var indiceJ1 = false;
    var indiceJ2 = false;
    if (array){
        [ indiceJ1, indiceJ2 ] = array;
    }
    
    const bool = ( !( indiceJ1 === false || indiceJ2 === false ) && !(indiceJ1 === indiceJ2) && !(indiceJ === indiceJ2 || indiceJ === indiceJ1) );
    if (! bool)
{
        joueurs[indiceJ].channel.send("Action pas légale");
        return false;
    }
    return true;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    var indiceJ1 = false;
    var indiceJ2 = false;
    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];

    [indiceJ1, indiceJ2] = deuxJoueursCherche(actionStr, joueurs);
    
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(`Vous avez échangé ${joueurs[indiceJ1].name} et ${joueurs[indiceJ2].name}`);
    })
    joueurs[indiceJ].aJoue = true;

} 


module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.NOISEUSE;