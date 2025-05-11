import fg from 'fast-glob';
const loadSlashCommands = async (bot, commandDir = 'build/slashCommands') => {
    const commandFiles = await fg(['**/*.js'], { cwd: commandDir, dot: true, absolute: true });
    console.log(`\nLoading slash commands...`);
    for (const commandFile of commandFiles) {
        const commandContent = await import(commandFile);
        // let command: BotCommand = new BotCommand(commandContent.help, commandFile, commandContent.run);
        // console.log(`\t${command.name}`);
        // bot.slashCommands.set(command.name, command);
    }
};
export { loadSlashCommands };
