class Joueur
{
    constructor (nom, tag)
{
        this.name = nom;
        this.tag = tag;
    }
}

function unJoueurCherche( chaineArgsMessage, joueurs)
{ // check ça marche
    var k = 1;
    const argsMessage = chaineArgsMessage.split(" ");
    var joueurName = argsMessage[0];
    for (var i = 0; i < joueurs.length; i++)
{
        if (joueurName === joueurs[i].tag || joueurName === joueurs[i].name)
{
            return i;
        }
    }
    while ( k < argsMessage.length )
{
    
        joueurName = `${joueurName} ${argsMessage[k]}`;

        for (var i = 0; i < joueurs.length; i++)
{
            if (joueurName === joueurs[i].tag || joueurName === joueurs[i].name)
{
                return i;
            }
        }
        k += 1;
    }
    return false;
}

function deuxJoueursCherche (chaineArgsMessage, joueurs)
{
    var k = 1;
    const argsMessage = chaineArgsMessage.split(" ");

    var indice1 = false;
    var indice2 = false;
    var boolJ1 = false;
    var boolJ2 = false;

    var joueurName1 = argsMessage[0];
    console.log(joueurName1);
    for (var i = 0; i < joueurs.length; i++)
{
        if (joueurName1 === joueurs[i].tag || joueurName1 === joueurs[i].name)
{
            boolJ1 = true;
            indice1 = i;
            break;
        }
    }
    
    while ( k < argsMessage.length-1 && !boolJ1)
{
        joueurName1 = `${joueurName1} ${argsMessage[k]}`;
        for (var i = 0; i < joueurs.length; i++)
{
            if (joueurName1 === joueurs[i].tag || joueurName1 === joueurs[i].name)
{
                boolJ1 = true;
                indice1 = i;
                break;
            }
        }
        k++;
    }

    if (boolJ1)
{
        var joueurName2 = argsMessage[k];
        for (var i = 0; i < joueurs.length; i++)
{
            if (joueurName2 === joueurs[i].tag || joueurName2 === joueurs[i].name)
{
                boolJ2 = true;
                indice2 = i;
                break;
            }
        }
        var l = k+1;
        while ( l < argsMessage.length && !boolJ2)
{
            joueurName2 = `${joueurName2} ${argsMessage[l]}`;            
            for (var i = 0; i < joueurs.length; i++)
{
                if (joueurName2 === joueurs[i].tag || joueurName2 === joueurs[i].name)
{
                    boolJ2 = true;
                    indice2 = i;
                    break;
                }
            }
            l ++;   
        }
        if (boolJ2) return [indice1, indice2];
        return false;
    }
    return false;
}

var joueurs = [ new Joueur ( "Papushkado", "Papushkado#4631"),
                new Joueur ( "Nicolas Ce BG", "Nicolas Ce BG#4998"),
                new Joueur ( "One night LG", "One night LG#8408"),
                new Joueur ( "Nesuvya Bg", "Nesuvya#3888"),
]
var indice1 = false;
var indice2 = false;
const array = deuxJoueursCherche ("Nesuvya Bg Nicolas Ce BG", joueurs);
if (array){
    [ indice1, indice2] = array;
}
console.log(  unJoueurCherche("Papushkado", joueurs));
console.log(  indice2);
