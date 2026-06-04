export function SwitchGameScript(ctx) {
    const user = ctx.data.userStore.get(ctx.data.userId);
    if (!user) {
        return ({
            title: "Switch Game",
            fields: [
                {
                    name: "",
                    value: "User not found"
                }
            ]
        });
    }
    return ({
        title: "Switch Game",
        fields: [
            {
                name: "\u200b",
                value: `Do you want to switch game ?\n*From ${(user.game) ? user.game.meta.id : "null"}*`
            }
        ]
    });
}
