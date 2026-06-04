import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js";
import { makeLgonId } from "../../../../../types/LgonId.js";
class Villageois extends NightRole {
    constructor(meta, owner) {
        super(meta, owner);
    }
}
export const roleGenerator = new RoleGenerator({
    id: makeLgonId("role", "villageois"),
    name: "Villageois",
    category: "Villageois",
    description: "La Villageois existe...",
    cdv: "Le Villageois est un villageois (étonnant non ?), il doit tuer un Loup pour gagner",
    usage: `Il n'a pas d'action`,
    aliases: ["Villageois"],
    action: false,
    information: false,
    vote: false,
}, Villageois);
