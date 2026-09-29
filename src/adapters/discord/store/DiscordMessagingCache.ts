import type { LgonId } from "types/LgonId.js"
import type { DiscordResource } from "../messaging/DiscordMessenger.js";

export class DiscordMessagingCache
{
	private rscs: Map<LgonId<"adapter">, DiscordResource>;
	
	constructor()
	{
		this.rscs = new Map<LgonId<"adapter">, DiscordResource>();
	}

	get(id: LgonId<"adapter">): DiscordResource | undefined
	{
		return ( this.rscs.get(id) );
	}

	add(id: LgonId<"adapter">, rscs: DiscordResource)
	{
		this.rscs.set(id, rscs);
	}

	rm(id: LgonId<"adapter">)
	{
		this.rscs.delete(id);
	}
}
