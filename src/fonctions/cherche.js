function aMesCotes (joueur, joueurs)
{ // retourne les joueurs à droite et à gauche 
    var aDroite = false;
    var aGauche = false;

    var joueursOrdre = new Array();
    for (var i = 0;  i < joueurs.length; i++ )
{
        joueursOrdre.push(false);
    }

    for (var i = 0;  i < joueurs.length; i++ )
{
        joueursOrdre [ joueurs[i].indiceInit ] = joueurs[i] ;
    }

    for (var i = 0; i < joueursOrdre.length; i++)
{
        if (joueursOrdre[i].id === joueur.id)
{
            aGauche = joueursOrdre[(i - 1)% joueursOrdre.length ];
            aDroite = joueursOrdre[(i + 1)% joueursOrdre.length ];
        }
    }
    return [aGauche, aDroite];
}

function joueurCherche( joueurName, joueurs)
{ // check ça marche
    for (var i = 0; i < joueurs.length; i++)
{
        if (joueurName === joueurs[i].tag || joueurName === joueurs[i].name)
{
            return i;
        }
    }
    return false;
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



function trouveLG (joueurs)
{  // renvoie la liste d'indices des Joueurs étant activement Lg
    var loups = new Array();
    for (var i = 0; i < joueurs.length; i++)
{
        if (joueurs[i].roleAction.split("-")[0] === "Loup")
{
            loups.push(i);
        }
    }
    /*var messageLoups = " ";
    for (var i = 0; i < loups.length; i ++)
{
        messageLoups = `${messageLoups} ${loups[i]}`;
    }
    erreurChannel.send(messageLoups); */

    return loups;
}

function rolesAJouerCherche (rolesJouesString, rolesJoues, joueurs)
{
    var rolesAJouer = new Array();
    for (var i = 0; i < joueurs.length; i ++)
{
        if (joueurs[i].aJoue === false)
{
            rolesAJouer.push(joueurs[i].roleAction.toLowerCase());
        }
    }
    var nbRolesAJouer = 0;
    var nbRolesJoues = 0;
    for (var i = 0; i < rolesAJouer.length; i++)
{
        if (rolesJouesString.toLowerCase() === rolesAJouer[i])
{
            nbRolesAJouer ++ ;
        }
    }
    for (var j = 0; j < rolesJoues.length; j++)
{
        if (rolesJouesString.toLowerCase() === rolesJoues[j].toLowerCase() )
{
            nbRolesJoues ++;
        }
    }

    var indice = -1;
    for (var k = 0; k < rolesJoues.length; k++)
{
        if (rolesJouesString.toLowerCase() === rolesJoues[k].toLowerCase())
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

module.exports =
{
    aMesCotes,
    joueurCherche,
    trouveLG,
    rolesAJouerCherche,
    unJoueurCherche,
    deuxJoueursCherche,
}