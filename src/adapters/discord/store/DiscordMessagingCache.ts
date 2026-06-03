import type { LgonId } from "types/LgonId.js"

export type MessageRef =
{
	channelId: string,
	msgId: string
};

export class DiscordMessagingCache
{
	private msgRefs: Map<LgonId<"view">, MessageRef>;
	
	constructor()
	{
		this.msgRefs = new Map<LgonId<"view">, MessageRef>();
	}

	get(viewId: LgonId<"view">): MessageRef | undefined
	{
		return ( this.msgRefs.get(viewId) );
	}

	getChannel(viewId: LgonId<"view">): string | undefined
	{
		return ( this.msgRefs.get(viewId)?.channelId );
	}

	add(viewId: LgonId<"view">, msgRefs: MessageRef)
	{
		this.msgRefs.set(viewId, msgRefs);
	}

	rm(viewId: LgonId<"view">)
	{
		this.msgRefs.delete(viewId);
	}
}