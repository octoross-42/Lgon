import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import { ActionRowBuilder, type MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, userMention } from "discord.js";
import type { Logger } from "infra/Logger.js";
import type { FlowContext, FlowData, InteractionModel, LgonButtonStyle, SelectOption } from "application/messaging/model/Flow.js";
import type { InteractionView,  } from "application/messaging/model/View.js";
import { LgonId } from "types/LgonId.js";

export type InteractionBuilder = ButtonBuilder | StringSelectMenuBuilder;

const DISCORD_BUTTON_STYLES: Record<LgonButtonStyle, ButtonStyle> =
{
	"blue": ButtonStyle.Primary,
	"red": ButtonStyle.Danger,
	"green": ButtonStyle.Success,
	"grey": ButtonStyle.Secondary,
	"link": ButtonStyle.Link
}

export class ComponentMaker
{
	constructor(private readonly logger: Logger) {}

	private makeComponentId<T extends FlowData>(interaction: InteractionModel<T>, viewId: LgonId<"view">): string
	{
		let id: string = interaction.interactionId + ":" + interaction.id + ":" + viewId;
		return (id);
	}

	private	componentMaker<T extends FlowData>(interaction: InteractionView<T>, viewId: LgonId<"view">, ctx: FlowContext<T>): InteractionBuilder | undefined
	{
		const customId: string = this.makeComponentId(interaction.model, viewId);
		if (customId.length > 100)
		{
			this.logger.event({ code: "COMPONENTS_ERROR", data: { error_on: `component ${customId}`, reason: "customId lenght > 100" } });
			return ;
		}

		if (interaction.model.kind === "button")
			return new ButtonBuilder()
				.setCustomId(customId) // 1-100
				.setLabel(interaction.model.build.label.slice(0, 34)) // 34 without icon or emoji, 38 with
				.setDisabled(!interaction.enabled)
				.setStyle(DISCORD_BUTTON_STYLES[interaction.model.build.style]);
		
		const options: SelectOption[] = interaction.model.build.options(ctx);
		const maxValues: number = Math.min((interaction.model.build.maxValues > 0) ? interaction.model.build.maxValues: options.length);
		return (new StringSelectMenuBuilder()
			.setCustomId(customId) // 1-100
			.setPlaceholder(interaction.model.build.placeholder.slice(0, 150)) //150 max
			.setMinValues(Math.min(Math.max(interaction.model.build.minValues, 0), 25)) // 0-25
			.setMaxValues(maxValues) // 25
			.setDisabled(!interaction.enabled)
			.addOptions(options.slice(0, 25).map(option => { return { // 25 options max
					label: option.label.slice(0, 100), // max 100
					value: option.value.slice(0, 100), // max 100
					description: option.description?.slice(0, 100) } }))); // max 100
	}


	public make<T extends FlowData>(interactions: InteractionView<T>[][], viewId: LgonId<"view">, ctx: FlowContext<T>): ActionRowBuilder<MessageActionRowComponentBuilder>[]
	{
		if (interactions.length === 0)
			return [];
		
		const components = [];
		let actionRow: ActionRowBuilder<MessageActionRowComponentBuilder>;
		let component: MessageActionRowComponentBuilder | undefined;

		let nbrSelectByRow: number;
		let nbrButtonByRow: number;
		let nbrRows: number;

		let i: number = 0;
		let j: number;
		while (i < interactions.length)
		{
			j = 0;
			actionRow  = new ActionRowBuilder<MessageActionRowComponentBuilder>();
			
			nbrSelectByRow = 0;
			nbrButtonByRow = 0;

			while (j < interactions[i].length)
			{
				if ((j >= 5) || (nbrSelectByRow >= 1) || (nbrButtonByRow >= 5))
				{
					this.logger.event( { code: "COMPONENTS_ERROR", data: { error_on: `${interactions[i][j].model.kind}`, reason: `too many components a row (select: ${nbrSelectByRow}, buttons: ${nbrButtonByRow})` } } )
					return (components);
				}

				component = this.componentMaker<T>(interactions[i][j], viewId, ctx);
				if ( !component )
				{
					j ++;
					continue;
				}
				actionRow.addComponents(component);
				
				if (interactions[i][j].model.kind === "select")
					nbrSelectByRow ++;
				else if (interactions[i][j].model.kind === "button")
					nbrButtonByRow ++;

				j ++;
			}
			components.push(actionRow);
			i ++;
		}
		return (components);
	}
}
