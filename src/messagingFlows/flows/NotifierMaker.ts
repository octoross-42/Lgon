import type { Flow, MessageScript } from "../model/Flow.js";

export function NotifierMaker(notifierScript: (contextId: string, userId: string) => MessageScript): Flow
{
	return [
	{
		id: "Notifier",
		steps: [{
			modes: [{
				mode: "basic",
				script: (contextId: string, userId: string) => notifierScript(contextId, userId),
				interactions: [[]]
			}],
			defaultMode: "basic"
		}]
	}
]}
