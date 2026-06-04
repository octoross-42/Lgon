import { pathToFileURL } from "node:url";
import fg from 'fast-glob';
export async function loadEvents(bot, lgon, eventDir = 'build/adapters/discord/events/events_list') {
    const eventsFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
    console.log(`\nLoading events...`);
    for (const evenFile of eventsFiles) {
        const event = (await import(pathToFileURL(evenFile).href));
        console.log(`\t${event.name}`);
        bot.on(event.name, event.onEvent.bind(null, lgon, bot));
    }
}
;
