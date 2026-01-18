import { PREFIX } from "../../../config/constantes.js"
import type { Player } from "../../../Player/Player.js";
import { LgonRole } from "../../../roles/LgonRole.js";
import { LgonRoleGenerator } from "../../../roles/LgonRoleGenerator.js"

class LoupGarou extends LgonRole
{
	constructor(generator: LgonRoleGenerator, owner: Player | string, id: number)
	{
		super(generator, owner, id);
	}
}

export const roleGenerator: LgonRoleGenerator = new LgonRoleGenerator(
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
