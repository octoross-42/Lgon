const
{ CONSTANTES } = require ("../../config/constantes.js");

module.exports.actionLegale = ( bot, guildId, indiceJ, joueurs, actionStr) =>
{
    
    const bool = actionStr === "gauche" || actionStr === "droite" ;
    if (! bool)
{
        joueurs[indiceJ].channel.send("Action pas légale");
        return false;
    }
    return true;

}

module.exports.action = (bot, guildId, indiceJ, joueurs) =>
{
    var indiceACote = false;
    const actionStr = joueurs[indiceJ].actionStr [ joueurs[indiceJ].actionStr.length -1];
    if ( actionStr === "gauche")
{
        indiceACote = (joueurs[indiceJ].indiceInit -1)% joueurs.length;
    } 
    else
{
        indiceACote = (joueurs[indiceJ].indiceInit +1)% joueurs.length;
    }
    joueurs[indiceJ].channel.createDM().then(channel =>
{
        channel.send(`Vous avez gentiment tapoté l'épaule de ${joueurs[indiceACote].name} 😊`);
    })
    joueurs[indiceACote].channel.createDM().then(channel =>
{
        channel.send(`La Chose vous a gentiment tapoté l'épaule 😊`);
    })
    

    joueurs[indiceJ].aJoue = true;

} 



module.exports.help = CONSTANTES.ROLESCATEGORIES.VILLAGEOIS.LA_CHOSE;