import { LOCALE } from "constants.js";

export type CommandMeta =
{
	name : string,
	description : Record<LOCALE, string>,
	nbrArgsRequired : number,
	cooldown: number,
	where: "any" | "guild" | "DM",
	aliases: Set<string>, 
	usage : string,
	category: string[]
};

