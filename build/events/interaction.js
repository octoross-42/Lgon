async function changeGame(bot, interaction, argv) {
    argv.shift();
    await bot.commands.get("change_game")?.run(bot, interaction.message, argv);
    interaction.deferUpdate();
    return;
}
export async function onEvent(bot, interaction) {
    if (interaction.isButton()) {
        console.log(`Button clicked: ${interaction.customId}`);
        let argv = interaction.customId.split(" ");
        if (argv[0] === "change_game")
            return changeGame(bot, interaction, argv);
        return;
    }
    else if (!interaction.isChatInputCommand())
        return;
    console.log(interaction);
    const slashCommand = bot.slashCommands.get(interaction.commandName);
    // TODO checker si une commande du meme nom existe pour un autre bot (la commande doit venir pour notre (bot)
    if (!slashCommand)
        return;
    // console.log(interaction);
}
export const name = "interactionCreate";
