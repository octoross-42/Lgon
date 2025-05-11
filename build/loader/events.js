import fg from 'fast-glob';
const loadEvents = async (bot, eventDir = 'build/events') => {
    const eventsFiles = await fg(['**/*.js'], { cwd: eventDir, dot: true, absolute: true });
    console.log(`\nLoading events...`);
    for (const evenFile of eventsFiles) {
        const event = await import(evenFile);
        console.log(`\t${event.name}`);
        bot.on(event.name, event.onEvent.bind(null, bot));
    }
};
export { loadEvents };
