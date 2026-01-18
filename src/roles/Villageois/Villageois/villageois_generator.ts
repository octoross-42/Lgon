import { LgonRole } from "../../../roles/LgonRole.js";
import { LgonRoleGenerator } from "../../../roles/LgonRoleGenerator.js";
import type { Player } from "../../../Player/Player.js";

class Villageois extends LgonRole
{
	constructor(generator: LgonRoleGenerator, owner: Player | string, id: number)
	{
		super(generator, owner, id);
	}
}
export const roleGenerator: LgonRoleGenerator = new LgonRoleGenerator(
	{
		name: "villageois",
		category: "Villageois",
		description: "La Villageois existe...",
		cdv: "Le Villageois est un villageois (étonnant non ?), il doit tuer un Loup pour gagner",
		usage: `Il n'a pas d'action`,
		aliases: ["Villageois"],
		action: false,
		information: false,
		vote: false,
	},
	Villageois
)
