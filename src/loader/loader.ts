import { Collection, Client } from "discord.js";
import { BotCommand } from "../types/BotCommand.js";
import { Game } from "../types/Game.js";
import { Player } from "../types/Player.js";
import { LgonRole } from "../types/LgonRole.js";

import { loadCommands } from "./commands.js";
import { loadEvents } from "./events.js";
import { loadRoles } from "./roles.js";

export async function loader(bot: Client): Promise<void>
{

	const collections = 
	{
	  commands: new Collection<string, BotCommand>(),
	  cooldowns: new Collection<string, Collection<string, number>>(),
	  roles: new Collection<string, LgonRole>(),
	  games: new Collection<string, Collection<string, Game>>(),
	  players: new Collection<string, Player>(),
	  // "channelsJeu",
	  // "messagesRoles",
	}
	
	Object.assign(bot, collections);

	await loadCommands(bot);
	await loadEvents(bot);
	await loadRoles(bot);
}