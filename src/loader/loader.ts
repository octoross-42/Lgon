import { Collection, Client } from "discord.js";
import { BotCommand } from "../classes/Commands/BotCommand.js";
import { Game } from "../classes/Game/Game.js";
import { Player } from "../classes/Game/Player.js";
import { AwaitingInteraction } from "../classes/Embed/AwaitingInteraction.js";
import { LgonRoleGenerator } from "../classes/LgonRole/LgonRoleGenerator.js";

import { loadCommands } from "./commands.js";
import { loadSlashCommands} from "./slashCommands.js";
import { loadEvents } from "./events.js";
import { loadRoles } from "./roles.js";
import { SlashCommand } from "../classes/Commands/SlashCommand.js";
import { LgonRole } from "src/classes/LgonRole/LgonRole.js";

export async function loader(bot: Client): Promise<void>
{

	const collections = 
	{
	  commands: new Collection<string, BotCommand>(),
	  slashCommands: new Collection<string, any>(),
	  cooldowns: new Collection<string, Collection<string, number>>(),
	  roles: new Collection<string, LgonRoleGenerator>(),
	  games: new Collection<string, Collection<string, Game>>(),
	  players: new Collection<string, Player>(),
	  awaitingInteractions: new Collection<string, AwaitingInteraction>(),
	  // "channelsJeu",
	  // "messagesRoles",
	}
	
	Object.assign(bot, collections);

	await loadCommands(bot);
	await loadSlashCommands(bot);
	await loadEvents(bot);
	await loadRoles(bot);
}