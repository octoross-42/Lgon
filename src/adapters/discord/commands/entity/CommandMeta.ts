export type CommandMeta =
{
	name : string,
	description : string,
	nbrArgsRequired : number,
	cooldown: number,
	where: "any" | "guild" | "DM",
	aliases: Set<string>, 
	usage : string,
	category: string[]
};

