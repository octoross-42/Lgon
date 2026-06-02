import type { LgonId } from "types/LgonId.js";

export type MessageScript =
{
	title: string,
	description?: string,
	fields: { name: string, value: string, inline?: boolean }[]
}

export interface Script
{
	make(): MessageScript
}

export interface ScriptMaker
{
	script(authorId: LgonId<"user">): Script
}
