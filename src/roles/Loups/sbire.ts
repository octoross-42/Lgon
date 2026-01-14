import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { LgonRoleGenerator } from "../../classes/LgonRole/LgonRoleGenerator.js";
import { Player } from "../../classes/Game/Player.js";

class Sbire extends LgonRole
{
	constructor(generator: LgonRoleGenerator, owner: Player | string, id: number)
	{
		super(generator, owner, id);
	}
}

const roleGenerator: LgonRoleGenerator = new LgonRoleGenerator(
	{
		name: "sbire",
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

export default {
	roleGenerator
}