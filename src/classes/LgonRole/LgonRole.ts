import { Player } from "../Game/Player.js";
import { LgonRoleHelp } from "discord.js";

export abstract class LgonRole
{
	// this.inGameId = -1;
	// this.rolesToKill = [];
	// this.playerToKill = [];
	// this.rolesToKeepAlive = [];
	// this.playersToKeepAlive = [];
	// this.run = run;
	
	id: number;
	owner: Player | string;
	help: LgonRoleHelp;
	// rolesToKill: number[];
	// playerToKill: string[];
	// rolesToKeepAlive: number[];
	// playersToKeepAlive: string[];
	
		// run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;
	
	constructor(help: LgonRoleHelp, owner: Player | string, id: number)
	{
		this.help = help;
		this.owner = owner;
		this.id = id;
	}

	abstract preshot_action(): void;

	

}
