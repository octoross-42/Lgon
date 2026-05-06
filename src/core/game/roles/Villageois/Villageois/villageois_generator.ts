import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js";
import type { Player } from "../../../entities/Game/modules/Players/Player.js";
import type { LgonRoleMeta } from "../../../entities/LgonRole/LgonRoleMeta.js";

class Villageois extends NightRole
{
	constructor(meta: LgonRoleMeta, owner: Player | string)
	{
		super(meta, owner);
	}
}
export const roleGenerator: RoleGenerator = new RoleGenerator(
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
