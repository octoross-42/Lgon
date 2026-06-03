import type { LgonUser } from "core/game/entities/LgonUser/LgonUser.js";
import { ActionRowBuilder, type MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, userMention } from "discord.js";
import type { Logger } from "infra/Logger.js";
import type { InteractionModel, LgonButtonStyle } from "messagingFlows/model/Flow.js";
import type { InteractionView,  } from "messagingFlows/model/View.js";

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

	private makeComponentId(interaction: InteractionModel, author: LgonUser): string
	{
		let id: string = interaction.id + ":";
		switch (interaction.customIdKind)
		{
			case ( "game" ):
			{
				if ( author.game )
					id = id.concat( author.game.meta.id );
				else
					id = id.concat( "error" );
				break;
			}
			case ( "user" ):
			{
				id = id.concat( author.id );
				break;
			}
			default:
			{
				console.log(interaction.customIdKind);
				id = id.concat( "error" );
				break;
			}
		}
		return (id);
	}

	private	componentMaker(interaction: InteractionView, author: LgonUser): InteractionBuilder | undefined
	{
		const customId: string = this.makeComponentId(interaction.model, author);
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
		
		const maxValues: number = (interaction.model.build.maxValues > 0) ? Math.min(interaction.model.build.maxValues, 25): interaction.model.build.options.length;
		return (new StringSelectMenuBuilder()
			.setCustomId(customId) // 1-100
			.setPlaceholder(interaction.model.build.placeholder.slice(0, 150)) //150 max
			.setMinValues(Math.min(Math.max(interaction.model.build.minValues, 0), 25)) // 0-25
			.setMaxValues(maxValues) // 25
			.setDisabled(!interaction.enabled)
			.addOptions(interaction.model.build.options.slice(0, 25).map(option => { return { // 25 options max
					label: option.label.slice(0, 100), // max 100
					value: option.value.slice(0, 100), // max 100
					description: option.description?.slice(0, 100) } }))); // max 100
	}


	public make(interactions: InteractionView[][], author: LgonUser): ActionRowBuilder<MessageActionRowComponentBuilder>[]
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

				component = this.componentMaker(interactions[i][j], author);
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