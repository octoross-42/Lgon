import { getRole } from "../classes/LgonRole/LgonRoleGenerator.js";
import { getGame } from "../classes/Game/Game";
function fitsType(bot, guild, type, value) {
    switch (type.split(" ")[0]) {
        case "string":
            return value;
        case "int":
            {
                let number = parseInt(value);
                if (isNaN(number))
                    return null;
                else
                    return number;
            }
        case "boolean":
            {
                let int = parseInt(value);
                if ((value === "true") || (int !== 0))
                    return true;
                else if ((value === "false") || (int === 0))
                    return false;
                else
                    return null;
            }
        case "role":
            return (getRole(bot, value));
        case "player":
            return (bot.players.get(value) || null);
        case "game":
            return (getGame(bot, guild, value));
        default:
            return null;
    }
}
function approximateValue(bot, guild, type, value) {
    return (null);
}
// TODO return des valeurs approximees exemple : role : villageois et c'est ecrit villagoeis
export function parsing(bot, guild, typesExpected, argv) {
    if (argv.length < typesExpected.length)
        return ("not enough args");
    let parsed = {};
    let indexTaken = [];
    let i = 0;
    typesExpected.filter((type) => typeof (type[1]) === "number").forEach((type) => {
        const index = type[1];
        if (indexTaken.includes(index))
            return ("args index not compatible");
        indexTaken.push(index);
        let value = fitsType(bot, guild, type[0], argv[index]);
        if (value === null)
            value = approximateValue(bot, guild, type[0], argv[index]);
        if (value === null)
            return ("args type not compatible");
        if (parsed.has(type[0]))
            return ("args name not compatible");
        parsed.set(type[0], value);
    });
    let necessaryParsed = {};
    typesExpected.filter((type) => type[1] === "necessary").forEach((type) => {
    });
    return (parsed);
}
