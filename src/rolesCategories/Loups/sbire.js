const
{ CONSTANTES } = require ("../../config/constantes.js");
const
{ trouveLG } = require ("./fonctions/cherche.js");

module.exports.envoieInfos = ( bot, guildId,  indiceJ, joueurs  ) =>
{
    var loups = trouveLG(joueurs);
    if (loups.length === 0 ){
        joueurs[indiceJ].roleFin = "Loup-garou";
        joueurs[indiceJ].roleAction = "Loup-garou";
        messageAEnvoyer = "Il n'y a aucun loup en jeu, vous devenez un Loup-garou 😎";
    }
    else if (loups.length === 1)
{
        messageAEnvoyer = `Le loup est ${joueurs[loups[0]].name}`;
    }
    else
{
        messageAEnvoyer = `Les loups sont :`;
        for (var i = 0; i < loups.length -1; i++){
            if (i === loups.length -2){
                messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name} et ${joueurs[loups[i + 1]].name}`;
            }
            else
{
                    messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name}, `;
            }
        }
    }
    joueurs[indiceJ].aJoue = true;
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(messageAEnvoyer);
    })
}



module.exports.help = CONSTANTES.ROLESCATEGORIES.LOUPS.SBIRE;