import { LgonRole } from "../../classes/LgonRole/LgonRole.js";
import { Player } from "../../classes/Game/Player.js";
import { CONSTANTES } from "../../config/constantes.js";

import { Client, LgonRoleHelp } from "discord.js";

class Villageois extends LgonRole
{
	constructor(help: LgonRoleHelp, printName: string, owner: Player | string, id: number)
	{
		super(help, printName, owner, id);
	}
}

function roleGenerator(help: LgonRoleHelp, printName: string, owner: Player | string, id: number): Villageois
{
	return (new Villageois(help, printName, owner, id));
}

const help = CONSTANTES.ROLES.VILLAGEOIS.VILLAGEOIS;

export
{
	roleGenerator,
	help
}