export function LobbyPlayersScript(ctx) {
    const game = ctx.data.gameStore.get(ctx.data.gameId);
    if (!game)
        return ({
            title: "Players",
            fields: [
                {
                    name: "",
                    value: "Game not found"
                }
            ]
        });
    const playersIds = game.players.getIds();
    const playersStr = ((playersIds.length > 0) ? "- <@" : "") + playersIds.join(">\n- <@") + ((playersIds.length > 0) ? ">" : "");
    return ({
        title: "Players",
        description: `*\`${ctx.data.gameId}\`*`,
        fields: [
            {
                name: "",
                value: playersStr
            }
        ]
    });
}
