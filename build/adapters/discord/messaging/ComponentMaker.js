import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";
const DISCORD_BUTTON_STYLES = {
    "blue": ButtonStyle.Primary,
    "red": ButtonStyle.Danger,
    "green": ButtonStyle.Success,
    "grey": ButtonStyle.Secondary,
    "link": ButtonStyle.Link
};
export class ComponentMaker {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    makeComponentId(interaction, viewId) {
        let id = interaction.id + ":" + viewId;
        return (id);
    }
    componentMaker(interaction, viewId, ctx) {
        const customId = this.makeComponentId(interaction.model, viewId);
        if (customId.length > 100) {
            this.logger.event({ code: "COMPONENTS_ERROR", data: { error_on: `component ${customId}`, reason: "customId lenght > 100" } });
            return;
        }
        if (interaction.model.kind === "button")
            return new ButtonBuilder()
                .setCustomId(customId) // 1-100
                .setLabel(interaction.model.build.label.slice(0, 34)) // 34 without icon or emoji, 38 with
                .setDisabled(!interaction.enabled)
                .setStyle(DISCORD_BUTTON_STYLES[interaction.model.build.style]);
        const options = interaction.model.build.options(ctx);
        const maxValues = Math.min((interaction.model.build.maxValues > 0) ? interaction.model.build.maxValues : options.length);
        return (new StringSelectMenuBuilder()
            .setCustomId(customId) // 1-100
            .setPlaceholder(interaction.model.build.placeholder.slice(0, 150)) //150 max
            .setMinValues(Math.min(Math.max(interaction.model.build.minValues, 0), 25)) // 0-25
            .setMaxValues(maxValues) // 25
            .setDisabled(!interaction.enabled)
            .addOptions(options.slice(0, 25).map(option => {
            return {
                label: option.label.slice(0, 100), // max 100
                value: option.value.slice(0, 100), // max 100
                description: option.description?.slice(0, 100)
            };
        }))); // max 100
    }
    make(interactions, viewId, ctx) {
        if (interactions.length === 0)
            return [];
        const components = [];
        let actionRow;
        let component;
        let nbrSelectByRow;
        let nbrButtonByRow;
        let nbrRows;
        let i = 0;
        let j;
        while (i < interactions.length) {
            j = 0;
            actionRow = new ActionRowBuilder();
            nbrSelectByRow = 0;
            nbrButtonByRow = 0;
            while (j < interactions[i].length) {
                if ((j >= 5) || (nbrSelectByRow >= 1) || (nbrButtonByRow >= 5)) {
                    this.logger.event({ code: "COMPONENTS_ERROR", data: { error_on: `${interactions[i][j].model.kind}`, reason: `too many components a row (select: ${nbrSelectByRow}, buttons: ${nbrButtonByRow})` } });
                    return (components);
                }
                component = this.componentMaker(interactions[i][j], viewId, ctx);
                if (!component) {
                    j++;
                    continue;
                }
                actionRow.addComponents(component);
                if (interactions[i][j].model.kind === "select")
                    nbrSelectByRow++;
                else if (interactions[i][j].model.kind === "button")
                    nbrButtonByRow++;
                j++;
            }
            components.push(actionRow);
            i++;
        }
        return (components);
    }
}
