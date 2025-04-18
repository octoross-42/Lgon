// IL FAUDRA TOUT REVOIR POUR LES PROMISES !!!!!!!


// Valeurs initiales constantes pour une partie 


const ROLES_DATA = ["Doppleganger",
        "Cupipute", 
        "Assassin", 
        "Loup-garou", 
        "Loup-alpha", 
        "Loup-chaman", 
        "Loup-dormeur", 
        "Sbire", 
        "Apprenti-tanneur",
        "Franc-maçon",
        "La Chose",
        "Voyante",
        "Apprentie-voyante",
        "Voleur",
        "Sorcière",
        "Noiseuse",
        "Soulard",
        "Insomniaque",
        "Blob",       //pour l'instant le blob n'a pas d'influence sur son expansion
        "Tanneur",
        "Prince",
        "Garde du corps",
        "Chasseur",
        "Villageois"];

const rolesAction = ["Doppleganger",
                    "Cupipute", 
                    "Assassin", 
                    "Loup-alpha", 
                    "Loup-chaman", 
                    "La Chose",
                    "Voyante",
                    "Apprentie-voyante",
                    "Voleur",
                    "Sorcière",
                    "Noiseuse",
                    "Soulard",]

const rolesGentil = ["Doppleganger",
                    "Cupipute", 
                    "Franc-maçon",
                    "La Chose",
                    "Voyante",
                    "Apprentie-voyante",
                    "Voleur",
                    "Sorcière",
                    "Noiseuse",
                    "Soulard",
                    "Insomniaque",
                    "Blob",       //pour l'instant le blob n'a pas d'influence sur son expansion
                    "Prince",
                    "Garde du corps",
                    "Chasseur",
                    "Villageois"];

const Discord = require('discord.js');
const bot = new Discord.Client();
const{CONSTANTES.PREFIX, TOKEN} =  require("./config.js");




// tous les noms de fichier qui se trouve dans commands


//////////////////////////////////////////////////////////////////////////////////////////

//  Classe joueurs 

class Joueurs
{
    constructor(auteur)
{
      this.aJoue = false;
      this.jouant = false;
      this.vote = false;
      this.nbVotes = 0;
      this.channel = auteur;
      this.actionStr = [false];
      this.name = auteur.username;
      this.victime = false; // aka le tableau d'indice de la personne qui doit mourir pour la victoire
      this.intouchable = false;
      this.protege = false;
      auteur.createDM().then(channel =>
{
          this.idChannel = channel.id;
        }).catch()
      

      this.roleInit = false;
      this.roleFin = false;
      this.roleAction = false;
    }

    enroler (roleInit)
{
      this.roleInit = roleInit;
      if (!(roleInit === false )){
          this.channel.createDM().then(channel =>
{
        channel.send (`Votre rôle est : ${roleInit}`);
      }).catch()
      }
      this.roleAction = roleInit;
      this.roleFin = roleInit;
    }

    actionLegale(actionStrElmt)
{ // indique action en attente et est faux si action pas valide
        
        var indiceJA = joueurCherche2(actionStrElmt);
        var indiceJ = joueurCherche(this.channel);
        var indiceC = whichCentreCherche(actionStrElmt);

        var bool = false;

        switch (this.roleAction)
{
            
            case "Doppleganger":
            case "Cupipute":
            case "Assassin":
            case "Voleur":
            
                if (!(indiceJA === false) && !(indiceJ === indiceJA) )
{ 
                    bool = true;  // l'action doit être différente que soi-même
                }
                break;
                
            case "Loup-garou":
            case "Soulard":
                if (!(indiceC === false))
{  //regarde une carte au centre
                    bool = true;
                }
                break;

            case "Sorcière":
                if (this.actionStr.length === 1)
{
                    if (!(indiceC === false))
{  //regarde une carte au centre
                        bool = true;
                    }
                }
                else
{
                    if (actionStrElmt === "rien" || !(indiceJA === false) ){
                        bool = true;
                    }
                }
                break;

            case "Loup-alpha":
            case "Loup-chaman":
                if (!(indiceJA === false) && !(indiceJ === indiceJA)  && !(trouveLG().includes(indiceJA))) 
{ //contamine une autre personne que les Loups qu'il connait
                    bool = true;
                }
                else if (isAction("Loup-alpha") && !(indiceC === false))
{
                    bool = true;
                }
                break;

            case "La Chose":
                if (actionStrElmt === "droite" || actionStrElmt === "gauche")
{
                    bool = true;
                }
                break;

            case "Voyante":
                var chaines = couperChaine(actionStrElmt, " ");
                if (chaines[0] === "gauche" || chaines[0] === "milieu" || chaines[0] === "droite"){
                    if (chaines[1] === "et" && !(chaines[2] === chaines[0]) && (chaines[2] === "gauche" || chaines[2] === "milieu" || chaines[2] === "droite"))
{
                        bool = true; // deux rôles au milieu
                    }
                }
                else if (!(indiceJA === false) && !(indiceJ === indiceJA) )
{ 
                    bool = true; // ou une personne
                }
                break;

            case "Apprentie-voyante":
                if ((!(indiceJA === false) && !(indiceJ === indiceJA) ) || !(indiceC === false)){
                    bool = true;
                }
                break;
            
            case "Noiseuse":
                var chaines = couperChaine(actionStrElmt, " ");
                var indiceJ1 = joueurCherche2(chaines[0]);
                var indiceJ2 = joueurCherche2(chaines[2]);
                if (!(indiceJ1 === false) && !(indiceJ2 === false) && !(indiceJ1 === indiceJ2) && chaines[1] === "et"){
                    bool = true;            // structure :  Joueur1 et Joueur2
                }
                break;

            
        }
        if (bool)
{
            return true;
        }
        this.channel.createDM().then( channel =>
{
            channel.send("Votre action n'est pas légale");
        }

        ).catch(error =>
{erreurChannel.send(`Impossible d'envoyer un DM à ${this.name} 😢`);})
        return false;

    }


    action ()
{
        var indiceJ = joueurCherche(this.channel);
        var indiceJA = joueurCherche2 (this.actionStr[this.actionStr.length -1]);
        var indiceC = whichCentreCherche(this.actionStr[this.actionStr.length -1]);

        var messageAction = "ActionStr :";
        for ( var i = 0; i < this.actionStr.length; i ++)
{
            messageAction = `${messageAction} ${this.actionStr[i]}`;
        }
        //erreurChannel.send (messageAction);
        
        var messageAEnvoyer = new String();

        
    

        switch (this.roleAction)
{
            
            case "Doppleganger":
                this.roleAction = joueurs[indiceJA].roleInit;    
               
                messageAEnvoyer = `La personne que vous avez doppleganger est : ${this.roleFin}`; 


                if ( isAction(joueurs[indiceJA].roleInit) === true && !(joueurs[indiceJA].roleInit === "Doppleganger"))
{
                    messageAEnvoyer = `${messageAEnvoyer} \nVeuillez jouer votre nouveau rôle maintenant`;
                    const actionStrElmt = false;
                    this.actionStr.push(actionStrElmt);
                }
                

                else
{
                    this.aJoue = true;  
                    messageAEnvoyer = `${messageAEnvoyer} \nFélicitations ! Vous avez fini de jouer !`;
                }
                break;

            case "Cupipute":
                
                joueurs[indiceJA].aJoue = true;
                
                joueurs[indiceJA].roleAction = "Villageois";
                this.aJoue = true;

                joueurs[indiceJA].channel.createDM().then(channel =>
{
                    channel.send(`Vous avez malheureusement été visité par la pute, vous ne pourrez pas jouer...`);
                }).catch() //error =>
{erreurChannel.send("La pute elle veut pas visiter wesh");}

                
                messageAEnvoyer = `Félicitations ! Vous avez fini de jouer !`;
                
                break;
            
            case "Assassin":
                this.vitcime = [indiceJA];
                this.aJoue = true;

                messageAEnvoyer = `Félicitations ! Vous avez fini de jouer !`;
                break;
            
            case "Loup-garou":
                if (isAction("Loup-garou") === true)
{
                    try
{ messageAEnvoyer = `Le rôle est : ${rolesCentre[indiceC]}`;}
                    catch (error)
{erreurChannel.send("On ne trouve pas le rôle au centre");}
            
                    
                }
                else
{
                    //testChannel.send("LGs passifs");
                    var loups = trouveLG();

                    var messageTest = "Les loups sont : "; 
                    for(var i = 0; i < loups.length; i ++){
                        messageTest = `${messageTest} ${loups[i]}`;
                    }

                    if (loups.length === 2)
{ // toi et une autre personne
                        if (indiceJ === loups[0]){
                            messageAEnvoyer = `Le loup avec toi est : ${joueurs[loups[1]].name}`;
                        }
                        else
{
                            messageAEnvoyer = `Le loup avec toi est : ${joueurs[loups[0]].name}`;
                        }
                    }
                    else
{
                        messageAEnvoyer = "Les loups avec toi sont : ";
                        for (var i = 0; i < loups.length -1 ; i++){
                            if (! (i ===  indiceJ)){    // les loups avec toi ne sont pas toi
                                if (indiceJ === loups[loups.length -1])
{ // si tu es à la fin
                                    if (i === loups.length -3){
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name} et ${joueurs[loups[i + 1]].name}`;
                                        break;
                                    }
                                    else
{
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name}, `;
                                    }
                                }
                                else if (indiceJ === loups[loups.length -2])
{ // si tu es à la fin mais presque
                                    if (i === loups.length -3){
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name} et ${joueurs[loups[i + 2 ]].name}`;
                                        break;
                                    }
                                    else
{
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name}, `;
                                    }

                                }
                                else{
                                    if (i === loups.length -2){   // si t'es pas à l'arrière t'es à l'avant
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i -2 ]].name} et ${joueurs[loups[i -1]].name}`;
                                    }
                                    else
{
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name}, `;
                                    }
                                }
                            }
                        }
                    }
                    
                }
                messageAEnvoyer = `${messageAEnvoyer} \nFélicitations ! Vous avez fini de jouer !`;

                this.aJoue = true;
                break;
            

            case "Loup-alpha" :

                loups = trouveLG();

                if (loups.length  === 1 )
{
                    if (!(indiceJA === false))
{
                        joueurs[indiceJA].roleFin = "Loup-garou";
                        messageAEnvoyer = `Vous avez contaminé ${joueurs[indiceJA].name}`;
                    }
                    else if (!(indiceC === false ))
{
                        messageAEnvoyer = `Le rôle est : ${rolesCentre[indiceC]}`;
                    }
                    if (this.actionStr.length ===1)
{
                        this.actionStr.push(false);

                        messageAEnvoyer = `${messageAEnvoyer} \n Veuillez jouer votre autre action`;
                    }
                    else if (this.actionStr.length === 2)
{
                        //erreurChannel.send ("Youhou on est arrivés");
                        messageAEnvoyer = `${messageAEnvoyer} \nFélicitations ! Vous avez fini de jouer !`;
                        this.aJoue = true;
                    }

                }

                else
{
                    joueurs[indiceJA].roleFin = "Loup-garou";
                    messageAEnvoyer = `Vous avez contaminé ${joueurs[indiceJA].name}`;
                    messageAEnvoyer = `${messageAEnvoyer} \nFélicitations ! Vous avez fini de jouer !`;
                    this.aJoue = true;
                }
                break;

            case "Loup-chaman":
                loups = trouveLG();

                if (loups.length  === 1 )
{
                    if (!(indiceJA === false))
{
                        messageAEnvoyer = `La personne est ${joueurs[indiceJA].roleFin}`;
                    }
                    else if (!(indiceC === false ))
{
                        messageAEnvoyer = `Le rôle est : ${rolesCentre[indiceC]}`;
                    }
                    if (this.actionStr.length ===1)
{
                        this.actionStr.push(false);

                        messageAEnvoyer = `${messageAEnvoyer} \n Veuillez jouer votre autre action`;
                    }
                    else if (this.actionStr.length === 2)
{
                        //erreurChannel.send ("Youhou on est arrivés");
                        messageAEnvoyer = `${messageAEnvoyer} \nFélicitations ! Vous avez fini de jouer !`;
                        this.aJoue = true;
                    }

                }

                else
{
                    joueurs[indiceJA].roleFin = "Loup-garou";
                    messageAEnvoyer = `Vous avez contaminé ${joueurs[indiceJA].name}`;
                    messageAEnvoyer = `${messageAEnvoyer} \nFélicitations ! Vous avez fini de jouer !`;
                    this.aJoue = true;
                }

                break;
        
            case "Sbire":
                var loups = trouveLG();
                if (loups.length === 0 ){
                    this.roleFin = "Loup-garou";
                    this.roleAction = "Loup-garou";
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

                messageAEnvoyer = `${messageAEnvoyer}\nFélicitations ! Vous avez fini de jouer !`;

                this.aJoue = true;
                break;

            case "Apprenti-tanneur":
                var tanneurs = new Array();
                for (var i = 0; i < joueurs.length; i++){
                    if (joueurs[i].roleFin === "Tanneur"){
                        tanneurs.push(i);
                    }
                }
                this.victime = tanneurs;
                
                if(tanneurs.length === 0 ){
                    this.roleFin = "Tanneur";
                    this.victime = indiceJ;
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

                messageAEnvoyer = `${messageAEnvoyer}\nFélicitations ! Vous avez fini de jouer !`;

                this.aJoue = true;

                break;


            case "Franc-maçon":
                var indiceFM = false;
                for (var i = 0; i < joueurs.length; i ++ ){
                    if (joueurs[i].roleAction === "Franc-maçon" && !(i === indiceJ)){
                        indiceFM = i;
                        break;
                    }
                }
                if (indiceFM === false){
                    messageAEnvoyer = `Vous êtes seul 😓 \Félicitations ! Vous avez fini de jouer !`;
                }
                else
{
                    messageAEnvoyer = `Vous êtes avec ${joueurs[indiceFM].name} ! \Félicitations ! Vous avez fini de jouer !`;
                }
                this.aJoue = true;

                break;

            case "La Chose":
                this.aJoue = true;
                var indiceAutre = -1;

                if (this.actionStr[this.actionStr.length -1] === "droite")
{
                    indiceAutre = indiceJ + 1;
                }
                else
{
                    indiceAutre = indiceJ - 1;
                }

                if (indiceAutre < 0)
{
                    //erreurChannel.send(indiceAutre + joueurs.length);
                    indiceAutre += joueurs.length;

                }
                else if (indiceAutre > joueurs.length -1)
{
                    //erreurChannel.send(indiceAutre - joueurs.length);
                    indiceAutre += (-1)* joueurs.length;
                }

                joueurs[indiceAutre].channel.createDM().then(channel =>
{
                    channel.send("La Chose vous a gentiment tapoté l'épaule 😊");
                }).catch()

                messageAEnvoyer = `Vous avez gentiment tapoté l'épaule de ${joueurs[indiceAutre]} \nFélicitations ! Vous avez fini de jouer !`;
                break;

            case "Voyante":

                var chaines = couperChaine(this.actionStr[this.actionStr.length -1], " ");
                if (chaines[0] === "gauche" || chaines[0] === "milieu" || chaines[0] === "droite"){ // 2 rôles au milieu 
                    var indiceC1 = whichCentreCherche(chaines[0]);
                    var indiceC2 = whichCentreCherche(chaines[2]);
                    messageAEnvoyer = `Le rôle ${chaines[0]} est ${rolesCentre[indiceC1]} et le rôle ${chaines[2]} est ${rolesCentre[indiceC2]} \nFélicitations ! Vous avez fini de jouer !`;

                    
                }
                else
{ // ou une personne
                    messageAEnvoyer = `Le rôle de cette personne est ${joueurs[indiceJA].roleFin} \nFélicitations ! Vous avez fini de jouer ! `;
                }
                this.aJoue = true;
                break;

            case "Apprentie-voyante":
                
                if (this.actionStr[this.actionStr.length -1] === "gauche" || this.actionStr[this.actionStr.length -1] === "milieu" || this.actionStr[this.actionStr.length -1] === "droite"){ // 1 rôle au milieu 

                    messageAEnvoyer = `Le rôle ${this.actionStr[this.actionStr.length -1]} est ${rolesCentre[indiceC]} \nFélicitations ! Vous avez fini de jouer !`;

                    
                }
                else
{ // ou une personne
                    messageAEnvoyer = `Le rôle de cette personne est ${joueurs[indiceJA].roleFin} \nFélicitations ! Vous avez fini de jouer ! `;
                }
                this.aJoue = true;
                break;

            case "Voleur":
                this.roleFin = joueurs[indiceJA].roleFin;
                joueurs[indiceJA].roleFin = "Voleur";
                messageAEnvoyer = `La personne que vous avez volé était : ${joueurs[indiceJ].roleFin}\nFélicitations ! Vous avez fini de jouer !`;
                
                this.aJoue = true;
                break;

            case "Sorcière":
                if (this.actionStr.length === 1)
{
                    messageAEnvoyer = `Le rôle désigné est : ${rolesCentre[indiceC]}, veuillez maintenant choisir ce que vous voulez en faire`;
                    this.actionStr.push(false);
                }

                else
{
                    if (this.actionStr[this.actionStr.length -1] === "rien")
{
                        "ababzoubazikou"
                    }
                    else
{
                        var rolePassage = rolesCentre [this.actionStr [0]];
                        rolesCentre [this.actionStr [0]] = joueurs[indiceJA].roleFin;
                        joueurs[indiceJA].roleFin = rolePassage;
                    }
                    this.aJoue = true;
                    messageAEnvoyer = `${messageAEnvoyer} \nFélicitations ! Vous avez fini de jouer !`;
                }
                break;

            case "Noiseuse":
                var chaines = couperChaine(this.actionStr[this.actionStr.length -1], " ");
                var indiceJ1 = joueurCherche2(chaines[0]);
                var indiceJ2 = joueurCherche2(chaines[2]);

                var role = joueurs[indiceJ1].roleFin;
                joueurs[indiceJ1].roleFin = joueurs[indiceJ2].roleFin;
                joueurs[indiceJ2].roleFin = role;

                messageAEnvoyer = `Vous avez échangé ${joueurs[indiceJ1].name} et ${joueurs[indiceJ2].name} \nFélicitations ! Vous avez fini de jouer !`;
                this.aJoue = true;
                
                break;
                
            case "Soulard":
                var role = this.roleFin;
                this.roleFin = rolesCentre [indiceC];
                rolesCentre[indiceC] = role;
                messageAEnvoyer = `Félicitations ! Vous avez fini de jouer !`;
                
                this.aJoue = true;
                break;

            

            case "Blob":       //pour l'instant le blob n'a pas d'influence sur son expansion
                this.protege = [ (indiceJ -1)%joueurs.length, (indice + 1)%joueurs.length];
                this.aJoue = true;
                break;

            case "Tanneur":
                this.victime = indiceJ;
                this.aJoue = true;
                break;

            case "Prince":
                this.intouchable = true;
                this.aJoue = true;
                break;

            case "Chasseur":
            case "Villageois":
            case "Loup-dormeur":
                this.aJoue = true;
                break;

            default:
                if ( this.roleInit = "Insomniaque")
{
                    messageAEnvoyer = `Votre rôle final est : ${this.roleFin}\nFélicitations ! Vous avez fini de jouer !`;
                    this.aJoue = true;
            //    erreurChannel.send("On n'a pas trouvé le rôle");
        }
        
        }
        if (!(messageAEnvoyer.length === 0))
{
            this.channel.createDM().then(channel =>
{
                channel.send(messageAEnvoyer);
            }).catch()
        }
    }
    

        
    
        
    

    joue(i, indiceJ, temps)
{
    try
{
        if (isAction(this.roleAction) === true )
{
            if (this.actionStr[this.actionStr.length -1] === false)
{

                this.channel.createDM().then(channel =>
{
                    
                    const filter = m => (m.content.startsWith('!joue')  && joueurs[indiceJ].actionLegale(m.content.slice(6)) === true)  ;
                    channel.awaitMessages(filter,
{ max: 1, time: 5*60000, errors: ['time'] })
                            .then(collected =>
{
                                                if (!(partie === false))
{
                                                    //channel.send(`Votre commande ${collected.first().content.slice(6)} a été pris en compte`);
                                                    joueurs[indiceJ].actionStr[joueurs[indiceJ].actionStr.length -1] = collected.first().content.slice(6) ;
                                                    joueurs[indiceJ].action();
                                                    
                                                    if (joueurs[indiceJ].aJoue === true){
                                                        partie.deroulementNuit(i+1, temps, false);
                                                    }
                                                    else
{
                                                        joueurs[indiceJ].joue(i, indiceJ, temps);
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
                                                partie.deroulementNuit(i+1, temps, false);
                                                });

                }).catch (error =>
{erreurChannel.send ("Envoyer un message privé est impossible")})

            }
            else
{
                if (this.actionLegale(this.actionStr[this.actionStr.length -1]))
{
                    this.action();
                    if (this.aJoue === true)
{ 
                        partie.deroulementNuit(i+1, temps, false);
                    } 
                    else
{
                        this.joue(i, indiceJ, temps);
                    }
                }
                else
{
                    this.channel.createDM().then( channel =>
{
                        channel.send("Votre action n'est plus légale veuillez rejouer");
                    }).catch()
                }
                

            }
        }
        else
{
            this.action();
            partie.deroulementNuit(i+1, temps, true);
        }
    }
    catch (err)
{
        erreurChannel.send("Erreur avec joue");
    }
    }

    envoieInfos()
{
        switch (this.roleAction)
{
            case "Loup-alpha":
            case "Loup-chaman":
                var indiceJ = joueurCherche(this.channel);
                var messageAEnvoyer = new String();
                var loups = trouveLG();

                if (loups.length === 1)
{
                    messageAEnvoyer = "Vous êtes seul...Vous pouvez regarder une carte au centre pour noyer votre tristesse";
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
                    }
                    else
{
                        messageAEnvoyer = "Les loups avec toi sont : ";
                        for (var i = 0; i < loups.length -1 ; i++){
                            if (! (i ===  indiceJ)){    // les loups avec toi ne sont pas toi
                                if (indiceJ === loups[loups.length -1])
{ // si tu es à la fin
                                    if (i === loups.length -3){
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name} et ${joueurs[loups[i + 1]].name}`;
                                        break;
                                    }
                                    else
{
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name}, `;
                                    }
                                }
                                else if (indiceJ === loups[loups.length -2])
{ // si tu es à la fin mais presque
                                    if (i === loups.length -3){
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name} et ${joueurs[loups[i + 2 ]].name}`;
                                        break;
                                    }
                                    else
{
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name}, `;
                                    }

                                }
                                else{
                                    if (i === loups.length -2){   // si t'es pas à l'arrière t'es à l'avant
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i -2 ]].name} et ${joueurs[loups[i -1]].name}`;
                                    }
                                    else
{
                                        messageAEnvoyer = `${messageAEnvoyer}${joueurs[loups[i]].name}, `;
                                    }
                                }
                            }
                        }
                    }
                
                this.channel.createDM().then (channel =>
{
                    channel.send (messageAEnvoyer);
                }).catch()
                break;
        }

    }

    aGagne(mort)
{
        
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

// Classe partie

class Partie
{
    constructor ()
{
        this.rolesChoisis = false;
        this.preparationFinie = false;
        this.nuitFinie = false; 
        this.vote = false;
        this.channel = testChannel;
    }

    debutNuit()
{
        this.preparationFinie = true;

        shuffle(joueurs);
        const a = Math.floor(Math.random() * (rolesJeu.length)) ;
        var b = Math.floor(Math.random() * (rolesJeu.length));
        while (b ===a)
{
            var b = Math.floor(Math.random() * (rolesJeu.length));
        }
        var c = Math.floor(Math.random() * (rolesJeu.length));
        while ((c ===a) || (c ===b))
{
            var c = Math.floor(Math.random() * (rolesJeu.length));
        }


        //this.channel.send(`${a} ${b} ${c}`);
            
            
        for (var j = 0; j < rolesJeu.length; j ++)
{
            if (j === a)
{
                rolesCentre.push(rolesJeu[j]);
            }
            else
{
                if (j=== b)
{
                    rolesCentre.push(rolesJeu[j]);
                }
                else
{
                    if (j ===c )
{
                        rolesCentre.push(rolesJeu[j]);
                    }
                    else
{
                        rolesJoues.push(rolesJeu[j]);
                    }
                }
            }
        }
        for (var j = 0; j < rolesJoues.length; j++)
{
            joueurs[j].enroler(rolesJoues[j]);
        }

        //verification();

        var temps = 0;
        this.deroulementNuit(0, temps, false);
    }

    deroulementNuit(i, temps, boolCentrePrec)
{
        

            if (boolCentrePrec === true)
{
            temps = temps + Math.floor(Math.random() * 5000) + 5000;
            }
            //testChannel.send(temps);

            if (i === rolesJeu.length){
                setTimeout(function(){
                    testChannel.send (`La nuit est finie ! Vous pouvez dès maintenant procéder aux votes `);
                    partie.derouleeNuit = true;
                }, temps)
                partie.nuitFinie = true;
            }
            else{
                setTimeout(function(){
                    testChannel.send (`C'est au tour du joueur répondant au rôle de ${rolesJeu[i]} de jouer`);
                  }, temps)
            
                var indiceJ = false;
                var indiceJ = rolesAJouerCherche(rolesJeu[i]);


                if (indiceJ === false){ 
                    this.deroulementNuit(i+1,  temps, true);
                }
                else
{
                    joueurs[indiceJ].jouant = true;
                    joueurs[indiceJ].envoieInfos ();
                    if (isAction(joueurs[indiceJ].roleAction) === true)
{

                                joueurs[indiceJ].channel.createDM().then(channel =>
{    
                                    
                                    channel.send("C'est à vous de jouer");
                                    
                                    try
{joueurs[indiceJ].joue(i, indiceJ, temps);}
                                    catch (error)
{
                                        erreurChannel.send(`Le joueur ${joueurs[indiceJ].channel} ne peut pas jouer`);
                                    }
                                        
                                }).catch(error =>
{
                                    erreurChannel.send(`Le joueur ${joueurs[indiceJ].channel} ne peut pas recevoir de messages privés !!`);
                                            })
                    }
                        
                    else
{
                        //testChannel.send("Rôle passif");
                        joueurs[indiceJ].joue(i, indiceJ,  temps );
                    }
                }
            }
        }       
    
    voter ()
{
        for (var i = 0; i < joueurs.length; i++)
{
            var indiceJV = joueurCherche2(joueurs[i].vote);
            if (joueurs[i].intouchable === false)
{
                joueurs[indiceJV].nbVotes += 1;
            }
        }
        
        maxNbVotes = 0;
        var mort = new Array();
        for (var i = 0; i < joueurs.length; i++)
{
            if (joueurs [i].nbVotes > maxNbVotes)
{
                mort = [i];
                maxNbVotes = joueurs[i].nbVotes;
            }
            else if (joueurs [i].nbVotes === maxNbVotes){
                mort.push(i);
            }
        }
        if (mort.length === joueurs.length)
{
            personneMort(); //messageEmbed
            for (var i = 0; i < joueurs.length; i++)
{
                joueurs[i].channel.createDM().then (channel =>
{
                    if (isGentil(joueurs[i].roleFin)){
                        channel.send(`Votre rôle en fin de partie est ${joueurs[i].roleFin}\nVous avez gagné ! Bravo à vous 🥳`);
                    }
                    else
{
                        channel.send(`Votre rôle en fin de partie est ${joueurs[i].roleFin}\nOh non... Vous avez LAMENTABLEMENT perdu...😢`);
                    }
                }).catch()
            }
        }
        else if (mort.length === 1 ){
            unMort();       //messageEmbed
            for (var i = 0; i < joueurs.length; i++)
{
                joueurs.aGagne(mort);
            }
        }
        else
{
            desMorts();
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function enleve(role, ROLES_DATA)
{
    var indices = new Array();
    for (var i = 0; i < ROLES_DATA.length; i++){
        if (ROLES_DATA[i] === role)
{
            indices.push(i);
        }
    }
    for (var i = indices.length - 1; i >= 0 ; i--){
        ROLES_DATA.splice(indices[i], 1);
    }
    return ROLES_DATA;
}


function stop ()
{
    var hashtagJ = new String();
    for (var i = 0; i < joueurs.length; i ++)
{
        hashtagJ = `${hashtagJ} ${joueurs[i].channel}`;
    }
    reinitialise();
    for (var i = 0; i < messagesRoles.length; i++)
{
        
    }
    
    testChannel.send (`La partie a été arrêtée ${hashtagJ}`);
    
}

function isGentil(role)
{

}

function personneMort ()
{

}

function unMort ()
{

}

function desMorts ()
{

}

function trouveLG ()
{  // renvoie la liste d'indices des Joueurs étant activement Lg
    var loups = new Array();
    for (var i = 0; i < joueurs.length; i++)
{
        if (couperChaine(joueurs[i].roleAction, "-")[0] === "Loup")
{
            loups.push(i);
        }
    }
    var messageLoups = " ";
    for (var i = 0; i < loups.length; i ++)
{
        messageLoups = `${messageLoups} ${loups[i]}`;
    }
    //erreurChannel.send(messageLoups);
    return loups;

}

function couperChaine(chaine, car)
{
    var images = [];
    var image = new String();
    for (var i = 0; i < chaine.length; i++){
        if (chaine[i] === car){
            images.push(image);
            image = new String();

        }
        else if ( i === chaine.length-1 ){
            image = `${image}${chaine[i]}`;
            images.push(image);
        }
        else
{
            image = `${image}${chaine[i]}`;
        }
    }
    return images;
} 

function verification (){
    var messageAEnvoyer = `\nListe des ROLES_DATA Jeu: \n`;
        for (var i = 0; i < rolesJeu.length; i++)
{
            messageAEnvoyer = `${messageAEnvoyer} \n ${rolesJeu[i]}`; 
        }
        erreurChannel.send(messageAEnvoyer);

        var messageAEnvoyer = `\nListe des ROLES_DATA Joués: \n`;
        for (var i = 0; i < rolesJoues.length; i++)
{
            messageAEnvoyer = `${messageAEnvoyer} \n ${rolesJoues[i]}`; 
        }
        erreurChannel.send(messageAEnvoyer);

        var messageAEnvoyer = `\nListe des ROLES_DATA Centre: \n`;
        for (var i = 0; i < rolesCentre.length; i++)
{
            messageAEnvoyer = `${messageAEnvoyer} \n ${rolesCentre[i]}`; 
        }
        erreurChannel.send(messageAEnvoyer);

        var messageAEnvoyer = `\nListe des participants: \n`;
        for (var i = 0; i < joueurs.length; i++)
{
            messageAEnvoyer = `${messageAEnvoyer} \n ${joueurs[i].channel}`; 
        }
        erreurChannel.send(messageAEnvoyer);
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



function reinitialise ()
{ // on reinitialise l'attribution des rôles et les actions des joueurs
    partie = false;
    //joueurs = new Array();
    rolesJoues = new Array();
    //rolesJeu = new Array();
    rolesCentre = new Array();

    for (var i = 0; i < joueurs.length; i++ )
{
        joueurs[i].enroler(false);
    }
}

function joueurCherche( joueurName)
{ // check ça marche
    for (var i = 0; i < joueurs.length; i++)
{
        if (joueurName.avatar === joueurs[i].channel.avatar && joueurName.username === joueurs[i].channel.username)
{
            return i;
        }
    }
    return false;
}

function joueurCherche2( joueurName)
{ // check ça marche
    for (var i = 0; i < joueurs.length; i++)
{
        if (joueurName === joueurs[i].name)
{
    
            return i;
        }
    }
    return false;
}


function whichCentreCherche(coteString)
{  // prends en argument un côté (gauche milieu ou droite) et renvoie l'indice associé dans rolesCentre
    if (coteString === "gauche")
{
        return 0;
    }
    else if (coteString === "milieu")
{
        return 1;
    }
    else if (coteString === "droite")
{
        return 2;
    }
    return false;
}

function rolesAJouerCherche (rolesJouesString)
{
    var rolesAJouer = new Array();
    for (var i = 0; i < joueurs.length; i ++)
{
        if (joueurs[i].aJoue === false)
{
            rolesAJouer.push(joueurs[i].roleAction);
        }
    }
    var nbRolesAJouer = 0;
    var nbRolesJoues = 0;
    for (var i = 0; i < rolesAJouer.length; i++)
{
        if (rolesJouesString === rolesAJouer[i])
{
            nbRolesAJouer ++ ;
        }
    }
    for (var j = 0; j < rolesJoues.length; j++)
{
        if (rolesJouesString === rolesJoues[j])
{
            nbRolesJoues ++;
        }
    }

    var indice = -1;
    for (var k = 0; k < rolesJoues.length; k++)
{
        if (rolesJouesString === rolesJoues[k])
{
            indice = k;
            break;            
        }
    }

    if (nbRolesAJouer === 0)
{
        return false;
    }

    else
{
        var indiceLeVraiLePoto = new Number();
        indiceLeVraiLePoto = indice + nbRolesJoues - nbRolesAJouer;

        return indiceLeVraiLePoto;
    }
}


function isAction(role)
{
    roleDebut = couperChaine(role, "-")[0];
    if (roleDebut === "Loup"){
        var nbLg = 0;
        for (var i = 0; i < joueurs.length; i ++)
{
            roleJDebut = couperChaine(joueurs[i].roleAction, "-")[0];
            if (roleJDebut === "Loup")
{
                nbLg +=1;
            }
        }
        if (nbLg ===1){
            return true;
        }
    }
    for (var i = 0; i < rolesAction.length; i ++)
{
        if (role === rolesAction[i])
{
            return true;
        }
    }
    return false;
}

function verificationDebutNuit ()
{
    var joueursNames = joueurs[0].name;
    var rolesString = rolesJeu[0];

    for (var i = 1; i < rolesJeu.length; i++)
{
        rolesString = `${rolesString}\n${rolesJeu[i]}`;
    }
    for (var i = 1; i < joueurs.length; i++)
{
        joueursNames = `${joueursNames}\n${joueurs[i].name}`;
    }

    const linkImage = "https://i.imgur.com/m3SG4PB.png";

    const messageEmbed = new Discord.MessageEmbed()
        .setColor('#158373')
        .setTitle('Partie')

        .setDescription('Réagir pour commencer (ou pas) la partie')
        .setThumbnail(linkImage)
        .addFields(
            //{ name: 'Regular field title', value: 'Some value here' },
           
{ name: '\u200B', value: '\u200B' },
           
{ name: 'Joueurs              ➖', value: joueursNames, inline: true },
           
{ name: 'Rôles', value: rolesString, inline: true },
           
{ name: '\u200B', value: '\u200B' },
        )
        //.addField('Inline field title', 'Some value here', false)
        //.setImage('https://i.imgur.com/m3SG4PB.png')
        .setTimestamp()
        .setFooter('One night Lg', linkImage);

    testChannel.send(messageEmbed).then(sentMessage =>
{
            debutPartieMessageEmbed.push( sentMessage);
            sentMessage.react("✅");
            sentMessage.react("❌");
            const filter = (reaction, user) =>
{
                return ['✅', '❌'].includes(reaction.emoji.name) && user.bot === false && reaction.message.id === debutPartieMessageEmbed[debutPartieMessageEmbed.length -1].id;}
            sentMessage.awaitReactions(filter,
{ max: 1, time: 3*60000, errors: ['time'] })
                .then(collected =>
{
                    const reaction = collected.first();
        
                    if (reaction.emoji.name === '✅')
{
                        sentMessage.channel.send('La nuit va pouvoir commencer, chaque joueur reçoit son rôle ! \n');
                        partie.debutNuit();
                    } 
                    else if (reaction.emoji.name === '❌')
{
                        stop();
                    }
            })
            //.catch(collected =>
{
            //    sentMessage.channel.send('La partie ne va pas avancer avec des tortues qui jouent...');
            //});
    })

    
}


bot.once("ready", () =>
{
    
    bot.user.setActivity("P'tit Lg ? 😎");
    partie = false;
    joueurs = new Array();
    rolesJoues = new Array();
    rolesJeu = new Array();
    rolesCentre = new Array();
    debutPartieMessageEmbed = new Array();

    testChannel = bot.channels.cache.find(ch => ch.name === "deroulement-jeu");
    rolesChannel = bot.channels.cache.find(ch => ch.name === "ROLES_DATA");
    erreurChannel = bot.channels.cache.find(ch => ch.name === "erreurs");

    rolesChannel.messages.fetch().then(function(list)
{ 
        rolesChannel.bulkDelete(list); 
    })
    
    messagesRoles = new Array();

    var messageRole = "Voici les rôles disponibles pour le moment : \n";
    for (var i = 0; i < ROLES_DATA.length; i++)
{
        messageRole =  `${messageRole}\n${i + 1}  ${ROLES_DATA[i]}` ;
    }
    /*rolesChannel.send(messageRole);

    for (var i = 0; i < ROLES_DATA.length; i++)
{
        //messageRole =  `${messageRole}\n${i + 1}  ${ROLES_DATA[i]}` ;
        
        rolesChannel.send(ROLES_DATA[i]).then(sentMessage =>
{
            sentMessage.react("0️⃣");
            sentMessage.react("1️⃣");
            sentMessage.react("2️⃣");
            sentMessage.react("3️⃣");
            //sentMessage.react("4️⃣");
            //sentMessage.react("5️⃣");
            //sentMessage.react("6️⃣");
            //sentMessage.react("7️⃣");
            //sentMessage.react("8️⃣");
            //sentMessage.react("9️⃣");
            messagesRoles.push(sentMessage);
        })


    }
    */

    messageRole = `${messageRole}\n\n Veuillez envoyer la commande associée aux rôles qui est : "${CONSTANTES.PREFIX}ROLES_DATA " puis une chaîne de chiffres indiquant le nombre d'un rôle à son indice (indice précisé sur la liste des rôles)\n\n`;
    rolesChannel.send(messageRole);

})


bot.on('message', (message) =>
{ //début de la partie

    
    if (message.content === `${CONSTANTES.PREFIX}ROLES_DATA`)
{
        var messageText = "Voici la liste des rôles choisis pour le jeu: \n";
        for (var i = 0;  i < rolesJeu.length; i++ )
{
            messageText = `${messageText}\n ${rolesJeu[i]}`;
        }
        message.channel.send(messageText);
    }

    else if (message.content.startsWith(`${CONSTANTES.PREFIX}changer channel jeu `)){
        var IdChannelJeu = message.content.slice(CONSTANTES.PREFIX.length + 20);
        try
{
            testChannel = message.guild.channels.cache.get(IdChannelJeu);
            testChannel.send("Opération réussie");
        }
        catch (err)
{
            message.channel.send("Le nom n'est pas un id valide");
        }
    }
    else if (message.content.startsWith(`${CONSTANTES.PREFIX}changer channel ROLES_DATA `)){
        var IdChannelRoles = message.content.slice(CONSTANTES.PREFIX.length + 22);
        try
{
            rolesChannel = message.guild.channels.cache.get(IdChannelRoles);
            rolesChannel.send("Opération réussie");
        }
        catch (err)
{
            message.channel.send("Le nom n'est pas un id valide");
        }
    }
    else if (message.content.startsWith(`${CONSTANTES.PREFIX}changer channel erreurs `)){
        
            var IdChannelErreurs = message.content.slice(CONSTANTES.PREFIX.length + 24);
            try
{
                erreurChannel = message.guild.channels.cache.get(IdChannelErreurs);
                erreurChannel.send("Opération réussie");
            }
            catch (err)
{
                message.channel.send("Le nom n'est pas un id valide");
            }
    }

    else if (message.content.startsWith( `${CONSTANTES.PREFIX}clear channel `))
{ // nettoyeur de channel
        const channelName = message.content.slice(14 + CONSTANTES.PREFIX.length);
        const channell = bot.channels.cache.find(ch => ch.name === channelName );
    
        channell.messages.fetch().then(function(list)
{
            channell.bulkDelete(list);
        })
    } 

    else if (message.content.startsWith(`${CONSTANTES.PREFIX}partie`))
{ // check ça marche
        if (partie === false)
{
            testChannel.send(`La partie va commencer ! Veuillez indiquer que vous jouer avec la commande "${CONSTANTES.PREFIX}joue". `)  //message channel
            partie = new Partie() ;
        }
        else
{
            testChannel.send("Une partie est déjà commencée"); // A FAIRE LA REINITIALISATION !!!! 
            return;
        }
    }

    if (partie === false) return;

     // LA GAME START DANS LES LIGNES SUIVANTES
     var indiceJ = joueurCherche(message.author);
    
    if (message.content === `${CONSTANTES.PREFIX}joueurs`)
{
        var messageText = "Voici la liste des joueurs : \n";
        for (var i = 0;  i < joueurs.length; i++ )
{
            messageText = `${messageText} ${joueurs[i].name}`;
        }
        message.channel.send(messageText);
    }

    

    else if (message.content === `${CONSTANTES.PREFIX}stop partie`){
        if (!(indiceJ === false)){
            stop();
        }
        else
{
            message.author.createDM().then(channel =>
{
                channel.send ("Vous ne pouvez pas arrêter la partie si vous ne jouez pas");
            }).catch()

        }
    }
    else if (!(indiceJ === false))
{
        if (joueurs[indiceJ].name === "Nesuvya")
{
            if (message.content === `${CONSTANTES.PREFIX}le recap svp`)
{
                var messageRoles = "Pour chaque joueur, son rôle initial, ses actions, son rôle final : \n";
                for (var i = 0; i < joueurs.length; i ++){
                    var messageAction = "actions : ";
                    for ( var j = 0; j < joueurs[i].actionStr.length; j ++)
{
                        if (!(joueurs[i].actionStr[i] === false))
{
                            messageAction = `${messageAction} ${joueurs[i].actionStr[j]}`;
                        }
                    }
                    messageRoles = `${messageRoles} \n${joueurs[i].name} -> ${joueurs[i].roleInit}, ${messageAction}, ${joueurs[i].roleFin}`;
                }
                testChannel.send(messageRoles);

            } 
        }
    }



    else if (partie.derouleeNuit)
{
        
        if (message.content.startsWith(`${CONSTANTES.PREFIX}votes`)){

            if (!(indiceJ == false)){
                const voteStr = couperChaine(message.content, " ")[0];
                var indiceJV = joueurCherche2(vote);
                const indiceJ = joueurCherche(message.author);
                if (!(indiceJV === false) && !(indiceJ === indiceJV)){
                    joueurs[indiceJ].vote = voteStr;

                    var nbVotes = 0;
                    for (var i = 0; i < joueurs.length; i++)
{
                        if (!(joueurs[i].vote === false))
{
                            nbVotes += 1;
                        } 
                    }
                    if (nbVotes === joueurs.length)
{
                        testChannel.send ("Tout le monde a voté, veuillez réagir pour confirmer les votes").then(sentMessage =>
{
                        sentMessage.react("✅");
                        sentMessage.react("❌");
                        const filter = (reaction, user) =>
{
                            return ['✅', '❌'].includes(reaction.emoji.name) && user.bot === false;}
                        sentMessage.awaitReactions(filter,
{ max: 1, time: 3*60000, errors: ['time'] })
                            .then(collected =>
{
                                const reaction = collected.first();
                        
                                if (reaction.emoji.name === '✅')
{
                                    partie.voter();
                                } 
                                else if (reaction.emoji.name === '❌')
{
                                    sentMessage.channel.send('Veuillez revoter (les votes sont conservés');

                                }
                            })

                        })
                    }
                }
            }
            else
{
                message.author.createDM().then(channel =>
{
                    channel.send ("Vous ne jouez pas, vous ne pouvez pas voter");
                }).catch()

            }
        }

    }


    else if (partie.preparationFinie === true)
{
        if (partie.nuitFinie === false)
{
            if (message.content.startsWith(`!joue`))
{
                if (!(indiceJ === false) )
{    
                    if (message.channel.id === joueurs[indiceJ].idChannel)
{
                        if (joueurs[indiceJ].jouant === false){
                            var action = couperChaine(message.content, " ");
                            action.slice(1,action.length);
                            const actionStrElmt = action.join(' ');
                            const actionLegalBool = joueurs[indiceJ].actionLegale(actionStrElmt);
                            if (actionLegalBool === false)
{
                                message.author.createDM().then(channel =>
{
                                    channel.send("Action ILLEGALE (c'est moche ça)");
                                }).catch()
                            }
                            else
{
                                joueurs[indiceJ].actionStr[ joueurs[indiceJ].actionStr.length -1 ] = actionStrElmt;
                                message.react("👍");
                            } 
                        }
                    }
                    else
{
                        message.channel.send (`Veuillez envoyer votre commande en privé`);
                    } 
                }
                else
{
                    message.author.createDM().then(channel =>
{
                        channel.send ("Vous ne jouez pas, vous ne pouvez pas jouer");
                    }).catch()
                }
            }
        }
        else
{
            return;  // ETAPE 1 Si la partie a déjà commencé de nouveaux joueurs ou des rôles ne peuvent pas être ajoutés
        }
    }
        
    else if (message.content.startsWith( `${CONSTANTES.PREFIX}dejoue`))
{
        if (!(indiceJ === false))
{

            joueurs[indiceJ].channel.createDM().then (channel =>
{
                channel.send("Vous ne jouez plus");
            }).catch()
            joueurs.splice(indiceJ, 1);

        }
        else
{
            message.author.createDM().then(channel =>
{
                channel.send("Vous ne pouvez pas vous retirer de la partie si vous ne jouez pas en premier lieu");
            })
        }
    }
    

    else if (message.content.startsWith( `${CONSTANTES.PREFIX}joue`))
{   //participation au jeu // check ça marche


        if (indiceJ === false)
{
            joueurs.push(new Joueurs(message.author)) ;
            message.author.createDM().then(channel =>
{
                channel.send ("Vous jouez ! Veuillez checker vos mps durant la nuit !");
            }).catch()

            
            //verification ();
            if (joueurs.length + 3 === rolesJeu.length)
{
                if (partie.rolesChoisis)
{
                    verificationDebutNuit();
                }
                // il faudrait plus de sécurité mais pour l'instant go
                
            }
        }
        else
{
            message.author.createDM().then(channel =>
{ // check ça marche
                channel.send ("Vous jouez déjà");
            }).catch()
        }
    }

        
     if (message.content.startsWith(`${CONSTANTES.PREFIX}ROLES_DATA`))
{  // choix des ROLES_DATA // check ça marche 

        const roleChaine = message.content.slice(CONSTANTES.PREFIX.length + 6);
        message.channel.send(`${roleChaine.length} ${ROLES_DATA.length}`);
        if (roleChaine.length === ROLES_DATA.length)
{
            rolesJeu = new Array();
            for (var i = 0; i < ROLES_DATA.length; i++)
{
                if  (parseInt(roleChaine.charAt(i)) > 0)
{
                    for (var j = 0; j < parseInt(roleChaine.charAt(i)); j++)
{
                        rolesJeu.push(ROLES_DATA[i] );
                    }
                }
            }
            partie.rolesChoisis = true;
            
            //var messageAEnvoyer = "Voici les ROLES_DATA choisis pour le jeu : \n";
            //for (var i = 0; i < rolesJeu.length; i++)
{
            //    messageAEnvoyer = `${messageAEnvoyer}\n${rolesJeu[i]}`;
            //}
            //rolesChannel.send(messageAEnvoyer);

            //verification ();

            if (joueurs.length  + 3 === rolesJeu.length)
{

                verificationDebutNuit();
            }
        }
    }
    
})

/*
bot.on("messageReactionAdd", (reaction, user) =>
{
    if (user.bot === true ) return ;
    if (debutPartieMessageEmbed.length)
{
        if (debutPartieMessageEmbed[debutPartieMessageEmbed.length -1].id === reaction.message.id) return;
    }
    var indiceM = false;
    var boolRoles = false;
    for(var i = 0; i < messagesRoles.length; i++)
{
        if (reaction.message.id === messagesRoles[i].id)
{
            boolRoles = true;
            indiceM = i;
            break;
        }
    }
    if (boolRoles && !(indiceM === false))
{
        if (['0️⃣', '1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name)){
            
            rolesJeu = enleve(ROLES_DATA[indiceM], rolesJeu);
            
            if (reaction.emoji.name === '0️⃣'){
                return;
            }
            else if (reaction.emoji.name === '1️⃣'){
                rolesJeu.push(ROLES_DATA[indiceM]);
            }
            else if (reaction.emoji.name === '2️⃣'){
                rolesJeu.push(ROLES_DATA[indiceM]);
                rolesJeu.push(ROLES_DATA[indiceM]);
            }
            else if (reaction.emoji.name === '3️⃣'){
                rolesJeu.push(ROLES_DATA[indiceM]);
                rolesJeu.push(ROLES_DATA[indiceM]);
                rolesJeu.push(ROLES_DATA[indiceM]);
            }
        }

        if (joueurs.length  + 3 === rolesJeu.length)
{
            if (joueurs.length ){
                verificationDebutNuit();
            }
        }
    }
})
*/

bot.login(TOKEN);