export function LobbyRolesScript(ctx) {
    const game = ctx.data.gameStore.get(ctx.data.gameId);
    if (!game)
        return ({
            title: "Roles",
            fields: [
                {
                    name: "",
                    value: "Game not found"
                }
            ]
        });
    const stocks = game.pickedRoles.getStock();
    const rolesStr = (stocks.length > 0) ? ("- " + stocks.map(stock => stock.gen.meta.name).join("\n- ")) : "*(null)*";
    const countStr = (stocks.length > 0) ? (stocks.map(stock => stock.qty.toString()).join("\n")) : "0";
    return ({
        title: "Roles",
        description: `*\`${ctx.data.gameId}\`*`,
        fields: [
            {
                name: "Role",
                value: `${rolesStr}`,
                inline: true
            },
            {
                name: "Count",
                value: `${countStr}`,
                inline: true
            }
        ]
    });
}
