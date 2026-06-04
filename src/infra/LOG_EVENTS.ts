export type LogEvent =
{
	code: EventCode;
	caller: {
		function: string,
		file: string,
		line: string
	} | null;
	data? : Record<string, unknown>;
	date: Date;
}

export type EventCode = "MESSAGE" | "COMMAND_RUN" | "COMMAND_FAIL" | "USECASE" | "INTERACTION" |
				"SEND_CHANNEL_INSTEAD" | "NOT_SENDABLE" | "COMPONENTS_ERROR" |
				"NOT_FOUND" | "DESIGN_ERROR" |
				"CREATE" | "DELETE" | "CANNOT_CREATE" |
				"ALREADY_JOINED" | "JOINED" | "CANNOT_JOIN" | "LEFT" | "CANNOT_LEAVE" | "SWITCHED";

export type EventDescription =
{
	lvl: "info" | "warning" | "error" | "debug";
	audience: "system";
	log: (data ? : Record<string, unknown>) => string;
};

export const EVENTS_DESCRIPTIONS: Record<EventCode, EventDescription> =
{
	DESIGN_ERROR: {
		lvl: "error",
		audience: "system",
		log: d => `System design error: ${d?.error}'`
	},
	MESSAGE: {
		lvl: "debug",
		audience: "system",
		log: d => `${d?.userId} sent '${d?.content}'`
	},
	NOT_SENDABLE: {
		lvl: "error",
		audience: "system",
		log: d => `Could not send a message, '${d?.channelId}' is not a sendable channel`
	},
	SEND_CHANNEL_INSTEAD: {
		lvl: "error",
		audience: "system",
		log: d => `Could not send message to message ${d?.msgId} of channel ${d?.channelId}, send to same channel instead`
	},
	COMPONENTS_ERROR: {
		lvl: "error",
		audience: "system",
		log: d => `Component error on ${d?.error_on}: ${d?.reason}`
	},
	NOT_FOUND: {
		lvl: "warning",
		audience: "system",
		log: d => `${d?.what} (${d?.whatId}) not found in ${d?.ctx}`
	},
	COMMAND_RUN: {
		lvl: "debug",
		audience: "system",
		log: d => `${d?.userId} run: '${d?.command}' with args '${(d?.args as string[]).join(" ")}'`
	},
	COMMAND_FAIL: {
		lvl: "debug",
		audience: "system",
		log: d => `${d?.userId} tried to run: '${d?.command}' with args '${(d?.args as string[]).join(" ")}' but failed because command ${d?.reason}`
	},
	USECASE: {
		lvl: "info",
		audience: "system",
		log: d => `${d?.userId} did: '${d?.command}'`
	},
	INTERACTION: {
		lvl: "info",
		audience: "system",
		log: d => `${d?.userId} triggered: '${d?.interaction}'`
	},
	JOINED: {
		lvl: "info",
		audience: "system",
		log: d => `${d?.userId} joined ${d?.gameId}`
	},
	CANNOT_JOIN: {
		lvl: "error",
		audience: "system",
		log: d => `${d?.userId} could not join ${d?.gameId} (not in setup phase)`
	},
	ALREADY_JOINED: {
		lvl: "warning",
		audience: "system",
		log: d => `${d?.userId} tried to join ${d?.gameId} but already joined`
	},
	LEFT: {
		lvl: "info",
		audience: "system",
		log: d => `${d?.userId} left ${d?.gameId}`
	},
	CANNOT_LEAVE: {
		lvl: "error",
		audience: "system",
		log: d => `${d?.userId} tried to leave ${d?.gameId} but cannot leave: ${d?.reason}`
	},
	SWITCHED: {
		lvl: "warning",
		audience: "system",
		log: d => `${d?.userId} switched from ${d?.from} to ${d?.to}`
	},

	CREATE: {
		lvl: "info",
		audience: "system",
		log: d => `Created ${d?.whatId}`
	},

	DELETE: {
		lvl: "info",
		audience: "system",
		log: d => `${d?.whatId} has been deleted: ${d?.reason}`,
	},

	CANNOT_CREATE: {
		lvl: "error",
		audience: "system",
		log: d => `Cannot create ${d?.what}: ${d?.reason}`
	}
}

