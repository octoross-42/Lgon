import type { RoleDescription } from "application/context/modules/LgonRoleGeneratorRegistry.js";
import type { FlowContext, FlowDataGame, SelectOption } from "application/messaging/model/Flow.js";

export function ChooseRoleOptions(ctx: FlowContext<FlowDataGame>): SelectOption[]
{
	let options: SelectOption[] = [];

	const descriptions: RoleDescription[] = ctx.data.gameStore.availableRoles.getDescriptions();
	for (const description of descriptions)
		options.push( { label: description.name, value: description.id, description: description.description } );

	return (options);
}