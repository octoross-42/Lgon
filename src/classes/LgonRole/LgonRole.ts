import { Player } from "../Game/Player.js";
import { LgonRoleHelp, Client } from "discord.js";

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
	printName: string;
	help: LgonRoleHelp;
	// rolesToKill: number[];
	// playerToKill: string[];
	// rolesToKeepAlive: number[];
	// playersToKeepAlive: string[];
	
		// run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;
	
	constructor(help: LgonRoleHelp, printName: string, owner: Player | string, id: number)
	{
		this.help = help;
		this.printName = printName;
		this.owner = owner;
		this.id = id;
	}

	async preshot_action(bot: Client): Promise<void> {}
	register_action(bot: Client, actions: string[]): void {}

	async play_auto() {}

}
