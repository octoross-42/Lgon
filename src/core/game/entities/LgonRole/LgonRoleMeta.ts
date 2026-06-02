import type { LgonId } from "types/LgonId.js";

export type LgonRoleMeta =
{
	name: LgonId<"role">;
	category: "Loup" | "Villageois" | "Independant";
	description: string;
	cdv: string;
	usage: string;
	aliases: string[];
	action: boolean;
	information: boolean;
	vote: boolean;
}
