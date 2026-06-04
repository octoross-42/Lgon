import { PREFIX } from "../../../../../constants.js";
import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js";
import { makeLgonId } from "../../../../../types/LgonId.js";
class LoupGarou extends NightRole {
    constructor(meta, owner) {
        super(meta, owner);
    }
}
export const roleGenerator = new RoleGenerator({
    id: makeLgonId("role", "loup-garou"),
    name: "Loup-Garou",
    category: "Loup",
    description: "Le Loup-garou se réveille dans la nuit pour prendre connaissance de sa meute ou s'il est seul regarde une carte au centre (et devient un type action)",
    cdv: "Aucun Loup ne doit mourir",
    usage: `S'il est seul : \`${PREFIX} action\` \`droite\` ou \`milieu\` ou \`gauche\``,
    aliases: ["lg"],
    action: false,
    information: true,
    vote: false,
}, LoupGarou);
