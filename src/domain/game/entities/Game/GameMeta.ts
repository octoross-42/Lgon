import { type LgonId, makeRandgonId } from "../../../../types/LgonId.js";

export class GameMeta
{
	readonly creationTime: Date;
	public readonly id: LgonId<"game">;
	static ids_count: number = 0;

	constructor()
				// public readonly where: LgonId<"where">)
	{
		this.id = makeRandgonId("game", GameMeta.ids_count ++);
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