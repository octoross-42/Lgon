import { NightRole } from "../../../entities/LgonRole/NightRole.js";
import { RoleGenerator } from "../../../entities/LgonRole/RoleGenerator.js";
import type { Player } from "../../../entities/Game/modules/Players/Player.js";
import type { LgonRoleMeta } from "../../../entities/LgonRole/LgonRoleMeta.js";

class Sbire extends NightRole
{
	constructor(meta: LgonRoleMeta, owner: Player | string)
	{
		super(meta, owner);
	}
}

export const roleGenerator: RoleGenerator = new RoleGenerator(
	{
		name: "sbire",
		aliases: [],
		category: "Loup",
		description: "Le Sbire n'est pas un Loup, mais les connait et en devient un s'il n'y a aucun Loup parmi les joueurs",
		cdv: "Aucun Loup ne doit mourir (il peut donc par exemple gagner en mourant",
		usage: `Il reçoit les noms des Loups et se rendort (n'a pas d'action)`,
		action: false,
		information: true,
		vote: false,
	},
	Sbire
)
