import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js";
import { makeLgonId } from "../../../../../types/LgonId.js";
class Sbire extends NightRole {
    constructor(meta, owner) {
        super(meta, owner);
    }
}
export const roleGenerator = new RoleGenerator({
    id: makeLgonId("role", "sbire"),
    name: "Sbire",
    aliases: [],
    category: "Loup",
    description: "Le Sbire n'est pas un Loup, mais les connait et en devient un s'il n'y a aucun Loup parmi les joueurs",
    cdv: "Aucun Loup ne doit mourir (il peut donc par exemple gagner en mourant",
    usage: `Il reçoit les noms des Loups et se rendort (n'a pas d'action)`,
    action: false,
    information: true,
    vote: false,
}, Sbire);
