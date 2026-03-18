import type { Client } from "discord.js";

import type { Command } from '../../commands/entity/Command.js';

import loadCommands from "./commands.js";
import loadSlashCommands from "./slashCommands.js";
import loadEvents from "./events.js";
import loadRoles from "./roles.js";
import type { LgonContext } from "../../../../application/context/LgonContext.js";

export async function loader(bot: Client, lgon: LgonContext): Promise<void>
{

	const collections = 
	{
		commands: new Map<string, Command>(),
		slashCommands: new Map<string, any>(),
		cooldowns: new Map<string, Map<string, number>>()
	}
	
	Object.assign(bot, collections);

	await loadCommands(bot);
	await loadSlashCommands(bot);
	await loadEvents(bot);
	await loadRoles(lgon);
}
