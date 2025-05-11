const
{ Collection } = require("discord.js");

var collec = new Collection ();
collec.set("1", [1,2,3]);
collec.set("2", [4,5,6]);
collec.set("3", [7,8,9]);

collec.set("5", 4);

var arr = collec.array();
arr.splice(3,1);



for (key of collec)
{
    console.log(key);
}

function arrayContient(array, elmt)
{
    for (var i = 0; i < array.length; i ++)
{
        if ( array[i] ===  elmt)
{
            return true;

        }
    }
    return false;
} 

const truc =  collec.find( value => collec.get(value) == [1,2,3]);


console.log(truc);
