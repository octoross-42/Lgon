const LOG_LEVELS = ["debug", "info", "warning", "error", "silent"]; 
export type LogLevel = typeof LOG_LEVELS[number];

export const defaultLogLvl = "info";

type LogEvent =
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

type EventCode = "COMMAND" | "ALREADY_JOINED" | "JOINED" | "CANNOT_JOIN" | "LEFT" | "CANNOT_LEAVE" | "SWITCHED" | 
				"CREATE_USER" |
				"GAME_NOT_FOUND" | "DESTROY_GAME" | "CANNOT_CREATE_GAME"; 
type EventDescription =
{
	lvl: "info" | "warning" | "error";
	audience: "user" | "system";
	log: (data ? : Record<string, unknown>) => string;
	user_text? : (data ? : Record<string, unknown>) => string;
}

const EVENTS_DESCRIPTIONS: Record<EventCode, EventDescription> =
{
	COMMAND: {
		lvl: "info",
		audience: "system",
		log: d => `${d?.userId} did: '${d?.command}`
	},
	JOINED: {
		lvl: "info",
		audience: "user",
		log: d => `${d?.userId} joined game ${d?.gameId}`,
		user_text: d => `You joined game ${d?.gameId}.`
	},
	CANNOT_JOIN: {
		lvl: "error",
		audience: "user",
		log: d => `${d?.userId} could not join game ${d?.gameId} (not in setup phase)`,
		user_text: d => `You didn't join game ${d?.gameId} because it's not in setup phase.`
	},
	ALREADY_JOINED: {
		lvl: "warning",
		audience: "user",
		log: d => `${d?.userId} tried to join game ${d?.gameId} but already joined`,
		user_text: () => `You're already in this game.`                                                                                                                                                                                                                                                                          
	},
	LEFT: {
		lvl: "info",
		audience: "user",
		log: d => `${d?.userId} left game ${d?.gameId}`,
		user_text: d => `You left game ${d?.gameId}.`
	},
	CANNOT_LEAVE: {
		lvl: "error",
		audience: "user",
		log: d => `${d?.userId} tried to leave game ${d?.gameId} but cannot leave: ${d?.reason}`,
		user_text: d => `You cannot leave ${d?.gameId}: ${d?.reason}.`
	},
	SWITCHED: {
		lvl: "warning",
		audience: "user",
		log: d => `${d?.userId} switched game from ${d?.from} to ${d?.to}`,
		user_text: d => `You switched game from ${d?.from} to ${d?.to}.`
	},

	CREATE_USER: {
		lvl: "info",
		audience: "system",
		log: d => `Created user ${d?.userId}`
	},

	GAME_NOT_FOUND: {
		lvl: "error",
		audience: "user",
		log: d => `Game ${d?.gameId} not found when ${d?.userId} ${d?.origin}`,
		user_text: d => `Game ${d?.gameId} not found`
	},

	DESTROY_GAME: {
		lvl: "info",
		audience: "user",
		log: d => `Game ${d?.gameId} has been destroyed: ${d?.reason}`,
		user_text: d => `${d?.reason}, ${d?.gameId} has been destroyed`
	},

	CANNOT_CREATE_GAME: {
		lvl: "error",
		audience: "user",
		log: d => `Cannot create game: creator ${d?.userId} cannot leave its game`,
		user_text: d => `You cannot create a new game when you cannot join it: you can't leave your current game`
	}
}


const colors: Record<LogLevel, string> =
{
	debug: "\x1b[90m",
	info: "\x1b[36m",
	warn: "\x1b[33m",
	error: "\x1b[31m",
};


const CURRENT_LOG_LVL: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? "info";

export class Logger
{
	ok: boolean;
	private events: LogEvent[];
	userLog: LogEvent[];
	

	constructor(private readonly log_lvl: LogLevel = defaultLogLvl)
	{
		this.ok = true;
		this.events = [];
		this.userLog = [];
	}

	private this_log_lvl_allows(to_approve_lvl: LogLevel): boolean { return (LOG_LEVELS.indexOf(to_approve_lvl) >= LOG_LEVELS.indexOf(this.log_lvl)); }
	static process_log_lvl_allows(to_approve_lvl: LogLevel): boolean { return (LOG_LEVELS.indexOf(to_approve_lvl) >= LOG_LEVELS.indexOf(CURRENT_LOG_LVL)); }

	static getCallerInfo()
	{
		const stack = new Error().stack;

		if (!stack)
			return null;

		const lines = stack.split("\n");
		const line = lines[2];

		let match = line.match(/at (.+) \((.+):(\d+):(\d+)\)/);
		if (!match)
		{
			match = line.match(/at (.+):(\d+):(\d+)/);
			if (!match)
				return null;
			
			return {
				function: "no function (direct call from file)",
				file: match[1],
				line: match[2]
			};
		}

		return {
			function: match[1],
			file: match[2],
			line: match[3]
		};
	}

	public event(logEventDescription: Omit<LogEvent, "date" | "caller">): void
	{
		const logEvent: LogEvent = { ...logEventDescription, caller: Logger.getCallerInfo(), date: new Date() };
		
		this.events.push(logEvent);
		const event_description = EVENTS_DESCRIPTIONS[logEvent.code];
		if (event_description.lvl === "error")
			this.ok = false;
		if (this.this_log_lvl_allows(event_description.lvl) && (event_description.audience === "user"))
			this.userLog.push(logEvent);
	
		Logger.console_log(logEvent);
	}

	static console_log(level: LogEvent)
	{
		const time = level.date.toISOString().slice(11, 19);
		const description = EVENTS_DESCRIPTIONS[level.code];
		if (Logger.process_log_lvl_allows(level.code))
			console.log(
				`${colors[description.lvl]}[${time}] [${description.lvl.toUpperCase()}] [${level.caller}] ${description.log(level.data)}\x1b[0m`
			);
	}
}

export const logger = new Logger();