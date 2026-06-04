export function onEvent(lgon, bot, reaction, user) {
    if (user.bot)
        return;
    console.log("Reaction received : ", reaction.emoji.name, reaction.message.id);
    // let awaitingInteraction: AwaitingInteraction = bot.awaitingInteractions.get(reaction.message.id);
    // if (awaitingInteraction)
    // 	awaitingInteraction.react(bot, reaction, user);
    // console.log("Reaction received : ", reaction.emoji);
}
export const name = "messageReactionAdd";
