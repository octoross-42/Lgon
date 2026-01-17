import { Guild } from "discord.js";

export class GameMeta
{
	readonly id: number;
	name: string;
	readonly guildId: string;
	guildName: string;
	readonly creationTime: Date;

	constructor(id: number, guild: Guild, name: string)
	{
		this.id = id;
		this.name = name;
		this.guildId = guild.id;
		this.guildName = guild.name;
		this.creationTime = new Date();
	}

	getCreationTime(): string
	{
		const creationTimeStr = new Intl.DateTimeFormat('fr', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).format(this.creationTime);
		return (creationTimeStr);
	}
	getCreationDate(): string
	{
		const creationDateStr = new Intl.DateTimeFormat('fr', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).format(this.creationTime);
		return (creationDateStr);
	}
}