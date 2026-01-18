import { Client, Guild } from "discord.js";
import { LgonRoleGenerator } from "../classes/LgonRole/LgonRoleGenerator.js";
import { getRole } from "../roles/helpers.js"
import { Player } from "../classes/Game/Player";
import { Game, getGame } from "../classes/Game/Game/Game";

function fitsType(bot: Client, guild: Guild, type: string, value: string): any
{
	switch (type.split(" ")[0])
	{
		case "string":
			return value;
		case "int":
		{
			let number: number = parseInt(value);
			if (isNaN(number))
				return null;
			else
				return number;	
		}
		case "boolean":
		{
			let int : number = parseInt(value);
			if ((value === "true") || (int !== 0))
				return true;
			else if ((value === "false") || (int === 0))
				return false;
			else
				return null;
		}
		case "role":
			return (getRole(bot, value));
		case "player":
			return (bot.players.get(value) || null);
		case "game":
			return (getGame(bot, guild, value))

		
	default:
		return null;
	}
}

function approximateValue(bot: Client, guild: Guild, type: string, value: string): any
{
	return (null);
}

// TODO return des valeurs approximees exemple : role : villageois et c'est ecrit villagoeis
export function parsing(bot: Client, guild: Guild, typesExpected: [string, number | "necessary" | "optional"][], argv: string[]): { [key: string]: any } | string
{
	if (argv.length < typesExpected.length)
		return ("not enough args");
	
	let parsed: { [key: string]: any } = {};
	let indexTaken: number[] = [];
	let i: number = 0;
	typesExpected.filter((type) => typeof(type[1]) === "number").forEach((type) => {
		const index: number = type[1] as number;
		if (indexTaken.includes(index))
			return ("args index not compatible");

		indexTaken.push(index);
		let value: any = fitsType(bot, guild, type[0], argv[index]);

		if (value === null)
			value = approximateValue(bot, guild, type[0], argv[index]);

		if (value === null)
			return ("args type not compatible");
		if (parsed.has(type[0]))
			return ("args name not compatible");
		parsed.set(type[0], value);
	});
	
	let necessaryParsed: { [key: string]: any } = {};
	typesExpected.filter((type) => type[1] === "necessary").forEach((type) => {

	});


	return (parsed);
}