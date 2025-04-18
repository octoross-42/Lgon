const
{ ROLES_DATA } = require("./config.js");

function enleve(role, ROLES_DATA)
{
    var indices = new Array();
    for (var i = 0; i < ROLES_DATA.length; i++){
        if (ROLES_DATA[i].toLowerCase() === role.toLowerCase())
{
            indices.push(i);
        }
    }
    for (var i = indices.length - 1; i >= 0 ; i--){
        ROLES_DATA.splice(indices[i], 1);
    }
    return ROLES_DATA;
}


function trie (rolesJeu)
{
    for (var i = 0; i < ROLES_DATA.length ; i++)
{
        var nbRolei = 0;
        for ( var j = 0; j < rolesJeu.length; j++)
{
            if (rolesJeu[j].toLowerCase() === ROLES_DATA[i].toLowerCase() )
{
                nbRolei ++;
            }
        }
        if (nbRolei)
{
            enleve(ROLES_DATA[i], rolesJeu);
            console.log(rolesJeu);
            for (var l = 0; l < nbRolei; l++)
{
                rolesJeu.splice(i, 0 , ROLES_DATA[i]);
            }
            console.log(rolesJeu);
        }
    }
    
    return rolesJeu;
}
module.exports =
{
    enleve,
    trie,
}