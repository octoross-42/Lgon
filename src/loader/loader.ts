import { Collection, Client, Role } from "discord.js";
import { Command } from "../types/Command.js";
import { Game } from "../types/Game.js";
import { Player } from "../types/Player.js";
import { loadCommands } from "./commands.js";
import { loadEvents } from "./events.js";
import { loadRoles } from "./roles.js";

export async function loader(bot: Client): Promise<void>
{

	const collections = 
	{
	  commands: new Collection<string, Command>(),
	  cooldowns: new Collection<string, Collection<string, number>>(),
	  roles: new Collection<string, Role>(),
	  games: new Collection<string, Collection<string, Game>>(),
	  players: new Collection<string, Player>(),
	  // "channelsJeu",
	  // "messagesRoles",
	};
	
	Object.assign(bot, collections);

	await loadCommands(bot);
	await loadEvents(bot);
	await loadRoles(bot);
}