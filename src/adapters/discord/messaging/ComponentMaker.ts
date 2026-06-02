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

	private	componentMaker(interaction: InteractionView, author: LgonUser): InteractionBuilder
	{
		if (interaction.model.kind === "button")
			return new ButtonBuilder()
				.setCustomId(this.makeComponentId(interaction.model, author))
				.setLabel(interaction.model.build.label)
				.setDisabled(!interaction.enabled)
				.setStyle(DISCORD_BUTTON_STYLES[interaction.model.build.style]);
		
		return (new StringSelectMenuBuilder()
			.setCustomId(this.makeComponentId(interaction.model, author))
			.setPlaceholder(interaction.model.build.placeholder)
			.setMinValues(interaction.model.build.minValues)
			.setMaxValues(interaction.model.build.maxValues)
			.setDisabled(!interaction.enabled)
			.addOptions(interaction.model.build.options));
}


	public make(interactions: InteractionView[][], author: LgonUser): ActionRowBuilder<MessageActionRowComponentBuilder>[]
	{
		if (interactions.length === 0)
			return [];
		
		const components = [];
		let actionRow: ActionRowBuilder<MessageActionRowComponentBuilder>;
		let component: MessageActionRowComponentBuilder;

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