import type { Client, Message } from "discord.js";
import { CONSTANTES } from "../config/constantes.js";

export class SlashCommand
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

}
