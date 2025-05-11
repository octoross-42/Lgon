import { CONSTANTES } from "../../config/constantes.js";
import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { Player } from "../../classes/Game/Player.js";

import { LgonRoleHelp } from "discord.js";

class Sbire extends LgonRole
{
	constructor(help: LgonRoleHelp, printName: string, owner: Player | string, id: number)
	{
		super(help, printName, owner, id);
		this.owner = "bwahahha";
	}

	preshot_action()
	{
		console.log("pet");
	}
}

function roleGenerator(help: LgonRoleHelp, printName: string, owner: Player | string, id: number): Sbire
{
	return (new Sbire(help, printName, owner, id));
}

const help = CONSTANTES.ROLES.LOUPS.SBIRE;

export
{
	roleGenerator,
	help
}