import { PREFIX } from '../../../../constants.js';
import { runWithTrace } from '../../../../infra/trace.js';
function getArgv(message) {
    const argv = message.content.split(/\s+/);
    if (argv.length < 2)
        return (null);
    if (argv[0].toLowerCase() !== PREFIX)
        return (null);
    argv.shift(); // remove PREFIX
    argv[0] = argv[0].toLowerCase();
    return (argv);
}
function getCommand(bot, argv) {
    const commandName = argv[0];
    return (bot.commands.get(commandName)
        || bot.commands.find(cmd => cmd.aliases?.includes(commandName)));
}
function fitsPlace(bot, command, message) {
    if (command.meta.where === "any")
        return (true);
    if (command.meta.where === "DM")
        return (message.guild ? false : true);
    return (message.guild ? true : false);
}
function isOnCooldown(bot, command, message) {
    if (!bot.cooldowns.has(command.meta.name))
        bot.cooldowns.set(command.meta.name, new Map());
    const timeNowMs = Date.now();
    let commandCdUsers;
    if (!bot.cooldowns.has(command.meta.name)) {
        commandCdUsers = new Map();
        bot.cooldowns.set(command.meta.name, commandCdUsers);
    }
    else
        commandCdUsers = bot.cooldowns.get(command.meta.name);
    const cooldownCommandMs = command.meta.cooldown * 1000;
    if (commandCdUsers.has(message.author.id)) {
        const endDownCooldownTimeMs = commandCdUsers.get(message.author.id) + cooldownCommandMs;
        if (timeNowMs < endDownCooldownTimeMs) {
            const timeLeftSec = (endDownCooldownTimeMs - timeNowMs) / 1000;
            // await message.reply({
            // 	content:` Cooldown restant pour \`${command.meta.name}\` pour l'utilisateur \`${message.author.tag}\` : ${timeLeftSec.toFixed(0)} secondes`,
            // 	flags: FLAGS,
            // };
            return (true);
        }
    }
    commandCdUsers.set(message.author.id, timeNowMs);
    setTimeout(() => commandCdUsers.delete(message.author.id), cooldownCommandMs);
    return (false);
}
function fitsArgs(commandMeta, argv) {
    return (argv.length - 1 >= commandMeta.nbrArgsRequired);
}
function sentWhere(message) {
    if (message.guild)
        return ("guild");
    return ("dm");
}
async function onMessage(lgon, bot, message) {
    lgon.logger.event({ code: "MESSAGE", data: { userId: message.author.id, content: message.content } });
    if (message.author.bot)
        return;
    let argv = getArgv(message);
    if (!argv)
        return;
    const command = getCommand(bot, argv);
    if (!command) {
        lgon.logger.event({ code: "COMMAND_FAIL", data: { userId: message.author.id, command: argv[0], args: argv.slice(1), reason: "not found" } });
        return;
    }
    if (!fitsArgs(command.meta, argv)) {
        lgon.logger.event({ code: "COMMAND_FAIL", data: { userId: message.author.id, command: command.meta.name, args: argv.slice(1), reason: "not enough args" } });
        return;
    }
    if (!fitsPlace(bot, command, message)) {
        lgon.logger.event({ code: "COMMAND_FAIL", data: { userId: message.author.id, command: command.meta.name, args: argv.slice(1), reason: `sent in ${sentWhere(message)} instead of ${command.meta.where}` } });
        return;
    }
    // if ( await isOnCooldown(bot, command, message) )
    // 	return ;
    argv.shift(); // remove command name
    lgon.logger.event({ code: "COMMAND_RUN", data: { userId: message.author.id, command: command.meta.name, args: argv } });
    command.run(lgon, message, argv);
}
export async function onEvent(lgon, bot, message) {
    await runWithTrace(async () => onMessage(lgon, bot, message));
}
export const name = "messageCreate";
