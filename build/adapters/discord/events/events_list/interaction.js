import { makeLgonId } from "../../../../types/LgonId.js";
import { runWithTrace } from '../../../../infra/trace.js';
function parseInteraction(str) {
    const splitted = str.split(":");
    return ({
        interactionName: splitted[0],
        args: splitted.slice(1).join(":")
    });
}
export async function onInteraction(lgon, bot, interaction, user) {
    if (interaction.isMessageComponent()) {
        const { interactionName, args } = parseInteraction(interaction.customId);
        if (!lgon.interactions.has(interactionName))
            return;
        interaction.deferUpdate();
        // interaction.deferReply( { ephemeral: true} );
        const userId = makeLgonId("user", interaction.user.id);
        if (interaction.isButton())
            lgon.interactions.button(interactionName, userId, args);
        else if (interaction.isStringSelectMenu())
            lgon.interactions.select(interactionName, userId, interaction.values, args);
    }
    else if (interaction.isChatInputCommand()) {
        // console.log(interaction);
        // const slashCommand = bot.slashCommands.get(interaction.commandName);
        // // TODO checker si une commande du meme nom existe pour un autre bot (la commande doit venir pour notre (bot)
        // if ( !slashCommand )
        // 	return ;
    }
    // console.log(interaction);
}
export async function onEvent(lgon, bot, interaction, user) {
    await runWithTrace(async () => onInteraction(lgon, bot, interaction, user));
}
export const name = "interactionCreate";
