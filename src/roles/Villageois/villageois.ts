import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { Player } from "../../classes/Game/Player.js";
import { CONSTANTES } from "../../config/constantes.js";

import { LgonRoleHelp } from "discord.js";

class Villageois extends LgonRole
{
	constructor(help: LgonRoleHelp, owner: Player | string, id: number)
	{
		super(help, owner, id);
		this.owner = "tralalalala";
	}

	preshot_action()
	{
		console.log("caca");
	}
}

function roleGenerator(help: LgonRoleHelp, owner: Player | string, id: number): Villageois
{
	return (new Villageois(help, owner, id));
}

const help = CONSTANTES.ROLES.VILLAGEOIS.VILLAGEOIS;

export
{
	roleGenerator,
	help
}