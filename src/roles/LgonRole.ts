import type { Player } from "../Player/Player.js";
import type { LgonRoleGenerator } from "./LgonRoleGenerator.js";
import type { Client } from "discord.js";

export abstract class LgonRole
{
	owner: Player | string;
	// rolesToKill: number[];
	// playerToKill: string[];
	// rolesToKeepAlive: number[];
	// playersToKeepAlive: string[];
	
		// run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;
	
	constructor(public readonly generator: LgonRoleGenerator,
			owner: Player | string,
			public readonly id: number)
	{
		this.owner = owner;
	}

	async preshot_action(bot: Client): Promise<void> {}
	register_action(bot: Client, actions: string[]): void {}
	play_auto(): void {}

}
