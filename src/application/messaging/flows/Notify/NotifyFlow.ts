import type { Flow, FlowContext } from "application/messaging/model/Flow.js";
import type { Script } from "application/messaging/model/View.js";

export const NotifyFlow = (script: Script): Flow<undefined> =>
{
	return ([{
		id: "Notifier",
		steps: [{
			modes: [{
				mode: "basic",
				script: (ctx: FlowContext<undefined>) => script,
				interactions: [[]]
			}],
			defaultMode: "basic"
		}]
	}]);
}
