import { Client, Command, Event } from 'discord.js';
import fg from 'fast-glob';

const loadEvents = async (bot: Client, eventDir = 'build/events'): Promise<void> =>
{
	// readdirSync(dir).forEach(dirs =>
	// {
	// 	const events = readdirSync (`${dir}/${dirs}/`).filter(files => files.endsWith('.ts'));
	// 	for (const event of events )
	// 	{
	// 		const evt = require(`${dir}/${dirs}/${event}`);
	// 		const evName = event.split(".")[0];
	// 		bot.on(evName, evt.bind(null, bot));
	
	// 		//https://www.youtube.com/watch?v=501eQ3kg7JU&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=21
	// 	};
	// });

	const events = await fg(['**/*'], { cwd: eventDir, dot: true, absolute: true });
	  
	for (const file of events)
	{
		console.log(file);

		const event: Event = await import(file);
		bot.on(event.name, event.onEvent.bind(null, bot));
	}
	
	console.log(events);
};

export { loadEvents }