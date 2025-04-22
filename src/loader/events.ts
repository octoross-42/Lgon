import { Client, Event } from 'discord.js';
import fg from 'fast-glob';

const loadEvents = async (bot: Client, eventDir = 'build/events'): Promise<void> =>
{
	const eventsFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
	  
	for (const evenFile of eventsFiles)
	{
		const event: Event = await import(evenFile);
		bot.on(event.name, event.onEvent.bind(null, bot));
	}
};

export { loadEvents }