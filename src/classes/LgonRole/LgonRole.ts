import { Player } from "../Game/Player.js";
import { LgonRoleGenerator } from "./LgonRoleGenerator.js";
import { Client } from "discord.js";

export abstract class LgonRole
{
	id: number;
	owner: Player | string;
	// rolesToKill: number[];
	// playerToKill: string[];
	// rolesToKeepAlive: number[];
	// playersToKeepAlive: string[];
	
		// run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;
	
	constructor(public readonly generator: LgonRoleGenerator,
			owner: Player | string,
			id: number)
	{
		this.owner = owner;
		this.id = id;
	}

	async preshot_action(bot: Client): Promise<void> {}
	register_action(bot: Client, actions: string[]): void {}
	play_auto(): void {}

}
