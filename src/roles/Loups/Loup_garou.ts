import { CONSTANTES } from "../../config/constantes.js";
import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { Player } from "../../classes/Game/Player.js";

import { LgonRoleHelp } from "discord.js";

class LoupGarou extends LgonRole
{
	constructor(help: LgonRoleHelp, printName: string, owner: Player | string, id: number)
	{
		super(help, printName, owner, id);
		this.owner = "tralalalala";
	}

	preshot_action()
	{
		console.log("prout");
	}
}

function roleGenerator(help: LgonRoleHelp, printName: string, owner: Player | string, id: number): LoupGarou
{
	return (new LoupGarou(help, printName, owner, id));
}

const help = CONSTANTES.ROLES.LOUPS.LOUP_GAROU;

export
{
	roleGenerator,
	help
}