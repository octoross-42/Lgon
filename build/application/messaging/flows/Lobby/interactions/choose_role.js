export function ChooseRoleOptions(ctx) {
    let options = [];
    const descriptions = ctx.data.gameStore.availableRoles.getDescriptions();
    for (const description of descriptions)
        options.push({ label: description.name, value: description.id, description: description.description });
    return (options);
}
