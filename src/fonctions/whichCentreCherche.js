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

module.exports =
{
    whichCentreCherche,
}