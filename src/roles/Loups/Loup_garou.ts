import { PREFIX } from "../../config/constantes.js"
import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { Player } from "../../classes/Game/Player.js";

import { LgonRoleGenerator } from "../../classes/LgonRole/LgonRoleGenerator.js"

class LoupGarou extends LgonRole
{
	constructor(generator: LgonRoleGenerator, owner: Player | string, id: number)
	{
		super(generator, owner, id);
	}
}

const roleGenerator: LgonRoleGenerator = new LgonRoleGenerator(
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

export default {
	roleGenerator
}