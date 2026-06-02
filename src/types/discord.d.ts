import type { Command } from "../.../core/commands/Command.js";
import type { RoleGenerator } from "./RoleGenerator.js";
import type { Game } from "../Game/Game.js";
import type { Player } from "../Game/Player.js";

import type
{
	Client,
	Collection
} from 'discord.js';

import type { LgonContext } from "../core/LgonContext/LgonContext.js";
import type { MessagingPort } from "application/ports/MessagingPort.ts";

declare module 'discord.js'
{
	export interface Event
	{
		name: string;
		onEvent: (lgon: LgonContext, ...args: any[]) => Promise<void> | void;
	}

	export interface Client
	{
		messenger: MessagingPort;
		commands: Collection<string, Command>;					 // command name -> Command
		// slashCommands: Map<string, any>;						// slash command name -> // TODO
		cooldowns: Map<string, Map<string, number>>;	// command name -> Map<userId, timestamp in ms> // TODO changer les cooldowns par personnes qui utilisent pas utilisation globale
	}
}