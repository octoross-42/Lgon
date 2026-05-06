import { PREFIX } from "../../../../../config/constantes.js"
import type { Player } from "../../../entities/Game/modules/Players/Player.js";
import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js"
import type { LgonRoleMeta } from "../../../entities/LgonRole/LgonRoleMeta.js";

class LoupGarou extends NightRole
{
	constructor(meta: LgonRoleMeta, owner: Player | string)
	{
		super(meta, owner);
	}
}

export const roleGenerator: RoleGenerator = new RoleGenerator(
	{
		name: "loup-garou",
		category: "Loup",
		description: "Le Loup-garou se réveille dans la nuit pour prendre connaissance de sa meute ou s'il est seul regarde une carte au centre (et devient un type action)",
		cdv: "Aucun Loup ne doit mourir",
		usage: `S'il est seul : \`${PREFIX} action\` \`droite\` ou \`milieu\` ou \`gauche\``,
		aliases: ["lg"],
		action: false,
		information: true,
		vote: false,
	},
	LoupGarou
)
