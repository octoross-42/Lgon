import type { FlowContext, FlowDataGame, SelectOption } from "application/messaging/model/Flow.js";

export function SelectNumberOptions(ctx: FlowContext<FlowDataGame>): SelectOption[]
{
	let options: SelectOption[] = [];

	let i: number = 1;
	while (i < 100)
	{
		if ( i === 1)
			options.push( { label: i.toString(), value: i.toString(), default: true } );
		else
			options.push( { label: i.toString(), value: i.toString() } );
		i ++;
	}

	return (options);
}