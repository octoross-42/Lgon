const
{ CONSTANTES } = require ("../../config/constantes.js");

module.exports.envoieInfos = ( bot, guildId, indiceJ, joueurs ) =>
{
    var messageAEnvoyer = new String ();
    joueurs[indiceJ].aJoue = true;

    var tanneurs = new Array();

    for (var i = 0; i < joueurs.length; i++){
        if (joueurs[i].roleFin.toLowerCase() === "tanneur"){
            tanneurs.push(i);
        }
    }
                
    if(tanneurs.length === 0 ){
        joueurs[indiceJ].roleFin = "Tanneur";
        messageAEnvoyer = "Il n'y a aucun tanneur en jeu, vous devenez tanneur 😎";
    }
    else if (tanneurs.length === 1)
{
        messageAEnvoyer = `Le tanneur est ${joueurs[tanneurs[0]].name}`;
    }
    else
{
        messageAEnvoyer = `Les tanneurs sont :`;
        for (var i = 0; i < tanneurs.length -1; i++){
            if (i === tanneurs.length -2){
                messageAEnvoyer = `${messageAEnvoyer}${joueurs[tanneurs[i]].name} et ${joueurs[tanneurs[i + 1]].name}`;
            }
            else
{
                messageAEnvoyer = `${messageAEnvoyer}${joueurs[tanneurs[i]].name}, `;
            }
        }
    }
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(messageAEnvoyer);
    })
}



module.exports.help = CONSTANTES.ROLESCATEGORIES.INDEPENDANTS.APPRENTIE_TANNEUR;