import { Collection } from "discord.js";
import { loadCommands } from "./commands.js";
import { loadSlashCommands } from "./slashCommands.js";
import { loadEvents } from "./events.js";
import { loadRoles } from "./roles.js";
export async function loader(bot) {
    const collections = {
        commands: new Collection(),
        slashCommands: new Collection(),
        cooldowns: new Collection(),
        roles: new Collection(),
        games: new Collection(),
        players: new Collection(),
        awaitingInteractions: new Collection(),
        // "channelsJeu",
        // "messagesRoles",
    };
    Object.assign(bot, collections);
    await loadCommands(bot);
    await loadSlashCommands(bot);
    await loadEvents(bot);
    await loadRoles(bot);
}
