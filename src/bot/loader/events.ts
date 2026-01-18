import type { Client, Event } from 'discord.js';

import { pathToFileURL } from "node:url";
import fg from 'fast-glob';

const loadEvents = async (bot: Client, eventDir = 'build/events'): Promise<void> =>
{
	const eventsFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
	console.log(`\nLoading events...`); 

	for (const evenFile of eventsFiles)
	{
		const event: Event = await import(pathToFileURL(evenFile).href);
			
		console.log(`\t${event.name}`);
		bot.on(event.name, event.onEvent.bind(null, bot));
	}
};

export default loadEvents;