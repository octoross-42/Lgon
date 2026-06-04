export function enableGameSetupInteraction(ctx) {
    const game = ctx.data.gameStore.get(ctx.data.gameId);
    if (!game)
        return (false);
    return (game.phase === "setup");
}
export function enableLeaveGameInteraction(ctx) {
    const game = ctx.data.gameStore.get(ctx.data.gameId);
    if (!game)
        return (false);
    return (game.phase === "setup");
}
export function enableSwitchToNewGameInteraction(ctx) {
    const user = ctx.data.userStore.get(ctx.data.userId);
    if (!user)
        return (false);
    if (!user.game)
        return (true);
    return (user.game.phase === "setup");
}
