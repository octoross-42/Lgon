export type LgonRoleMeta =
{
	name: string;
	category: "Loup" | "Villageois" | "Independant";
	description: string;
	cdv: string;
	usage: string;
	aliases: string[];
	action: boolean;
	information: boolean;
	vote: boolean;
}