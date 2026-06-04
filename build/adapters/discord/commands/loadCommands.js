import { Collection } from 'discord.js';
import { CreateGameCommand } from './commands_list/new_command.js';
export async function loadCommands(msgsCache, logger) {
    console.log(`\nLoading commands...`);
    let commands = new Collection();
    let commandList = [
        new CreateGameCommand(msgsCache, logger)
    ];
    for (const command of commandList) {
        if (commands.has(command.meta.name)) {
            logger.event({ code: "DESIGN_ERROR", data: { error: `Tried to register command '${command.meta.name}' for command but another command was already registered to this name` } });
            continue;
        }
        console.log(`\t${command.meta.name}`);
        commands.set(command.meta.name, command);
    }
    console.log(`\nLoading commands aliases...`);
    for (const command of commandList) {
        console.log(`\t${command.meta.name}`);
        for (const alias of command.meta.aliases) {
            if (commands.has(alias)) {
                logger.event({ code: "DESIGN_ERROR", data: { error: `Tried to register alias '${alias}' for command but another command was already registered to this name` } });
                continue;
            }
            console.log(`\t ⤷ ${alias}`);
            commands.set(alias, command);
        }
    }
    return (commands);
}
;
