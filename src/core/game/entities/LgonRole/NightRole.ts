import type { Player } from "../Game/modules/Players/Player.js";
import { LgonRoleMeta } from "./LgonRoleMeta.js";

export abstract class NightRole
{
	owner: Player | string;
	// rolesToKill: number[];
	// playerToKill: string[];
	// rolesToKeepAlive: number[];
	// playersToKeepAlive: string[];
	
		// run: (bot: Client, message: Message, argv: string[]) => Promise<void> | void;
	
	constructor(public readonly meta: LgonRoleMeta,
			owner: Player | string)
	{
		this.owner = owner;
	}

	async preshot_action(): Promise<void> {}
	register_action(actions: string[]): void {}
	play_auto(): void {}

}
