import { ERR_STATUS } from "application/usecases/STATUS.js"
import type { Flow } from "messagingFlows/model/Flow.js";

export const NotifyFlow = (status: ERR_STATUS): Flow =>
{
	return ([{
		id: "Notifier",
		steps: [{
			modes: [{
				mode: "basic",
				script: status,
				interactions: [[]]
			}],
			defaultMode: "basic"
		}]
	}]);
}
