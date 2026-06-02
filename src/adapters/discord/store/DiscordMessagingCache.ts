import type { LgonId } from "types/LgonId.js"
 import { ViewStore } from "messagingFlows/model/ViewStore.js";

export type MsgTargetCtx =
{
	channelId: string,
	msgId: string
};

export class DiscordMessagingCache
{
	private msgCtx: Map<LgonId<"view">, MsgTargetCtx>;
	private channelIds: Map<LgonId<"view">, string>;

	constructor()
	{
		this.msgCtx = new Map<LgonId<"view">, MsgTargetCtx>();
		this.channelIds = new Map<LgonId<"view">, string>();
	}

	get(viewId: LgonId<"view">): MsgTargetCtx | undefined
	{
		return ( this.msgCtx.get(viewId) );
	}

	getChannel(viewId: LgonId<"view">): string | undefined
	{
		return ( this.channelIds.get(viewId) );
	}

	add(viewId: LgonId<"view">, msgCtx: MsgTargetCtx)
	{
		this.msgCtx.set(viewId, msgCtx);
	}

	save(msgTargetCtx: MsgTargetCtx): LgonId<"view">
	{
		const viewId: LgonId<"view"> = ViewStore.makeViewId();
		this.msgCtx.set(viewId, msgTargetCtx);
		return (viewId);
	}

	rm(viewId: LgonId<"view">)
	{
		this.msgCtx.delete(viewId);
	}

	rmChannel(viewId: LgonId<"view">)
	{
		this.channelIds.delete(viewId);
	}
}