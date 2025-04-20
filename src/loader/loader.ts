import { Collection, Command, Client, Role } from "discord.js";
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
	  // "parties",
	  // "channelsJeu",
	  // "messagesRoles",
	  // "joueurs",
	  // "joueur"
	};
	
	Object.assign(bot, collections);

	await loadCommands(bot);
	await loadEvents(bot);
	await loadRoles(bot);	
}