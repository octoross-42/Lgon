import { ActionRowBuilder, type MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";

export type InteractionBuilder = ButtonBuilder | StringSelectMenuBuilder;

// function componentIdMaker(): string
// {

// }

function componentMaker(interaction: LgonInteraction): InteractionBuilder
{
	if (interaction.kind === "button")
		return new ButtonBuilder()
			.setCustomId("youpi") // TODO
			.setLabel(interaction.build.label)
			.setDisabled(interaction.build.disabled)
			.setStyle(interaction.build.style);
	
	return (new StringSelectMenuBuilder()
		.setCustomId("yaha") // TODO
		.setPlaceholder(interaction.build.placeholder)
		.setMinValues(interaction.build.minValues)
		.setMaxValues(interaction.build.maxValues)
		.setDisabled(interaction.build.disabled)
		.addOptions(interaction.build.options));
}


export function ComponentsMaker(interactions: LgonInteraction[][]): ActionRowBuilder<MessageActionRowComponentBuilder>[]
{
	if (interactions.length === 0)
		return [];
	
	const components = [];
	let actionRow: ActionRowBuilder<MessageActionRowComponentBuilder>;
	let component: MessageActionRowComponentBuilder;

	let nrbStringByRow: number;
	let nbrButtonByRow: number;
	let nbrRows: number;

	let i: number = 0;
	let j: number;
	while (i < interactions.length)
	{
		j = 0;
		actionRow  = new ActionRowBuilder<MessageActionRowComponentBuilder>();
		
		nrbStringByRow = 0;
		nbrButtonByRow = 0;

		while (j < interactions.length)
		{
			if ((j >= 5) || (nrbStringByRow >= 1) || (nbrButtonByRow >= 5))
			{
				console.log("error component maker components composition");
				return (components);
			}

			component = componentMaker(interactions[i][j ++]);
			actionRow.addComponents(component);
			
			if (interactions[i][j].kind === "select")
				nrbStringByRow ++;
			else if (interactions[i][j].kind === "button")
				nbrButtonByRow ++;
		}
		components.push(actionRow);
		i ++;
	}
	return (components);
}