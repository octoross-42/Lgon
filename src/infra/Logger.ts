import { getTraceId } from "./trace.js";
import { type LogLevel, type LogEvent, EVENTS_DESCRIPTIONS, defaultLogLvl, LOG_LEVELS } from "./LOG_EVENTS.js";

import { L_GREY, L_LBLUE, L_RED, L_ORANGE, L_RESET, L_ITALIC, L, L_LGREY, L_BLACK, L_YELLOW, L_BLUE } from "./LOG_FORMAT.js"

const colors: Record<LogLevel, string> =
{
	debug: `${L(L_GREY)}`,
	info: `${L(L_BLUE)}`,
	warning: `${L(L_YELLOW)}`,
	error: `${L(L_RED)}`,
};

// {
// 	lvl: "info" | "warning" | "error" | "debug";
// 	audience: "system";
// 	log: (data ? : Record<string, unknown>) => string;
// 	user_text : (data ? : Record<string, unknown>) => string;
// }

const CURRENT_LOG_LVL: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? "info";
console.log(`LOG LEVEL${colors[CURRENT_LOG_LVL]}`, CURRENT_LOG_LVL, L(L_RESET));

export class Logger
{
	ok: boolean;
	private events: LogEvent[];
	// userLog: LogEvent[];
	

	constructor(private readonly log_lvl: LogLevel = defaultLogLvl)
	{
		this.ok = true;
		this.events = [];
		// this.userLog = [];
	}

	private this_log_lvl_allows(to_approve_lvl: LogLevel): boolean { return (LOG_LEVELS.indexOf(to_approve_lvl) >= LOG_LEVELS.indexOf(this.log_lvl)); }
	static process_log_lvl_allows(to_approve_lvl: LogLevel): boolean { return (LOG_LEVELS.indexOf(to_approve_lvl) >= LOG_LEVELS.indexOf(CURRENT_LOG_LVL)); }

	static getCallerInfo()
	{
		const stack = new Error().stack;

		if (!stack)
			return null;

		const lines = stack.split("\n");
		const line = lines[3];

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
		// if (this.this_log_lvl_allows(event_description.lvl) && (event_description.audience === "user"))
		// 	this.userLog.push(logEvent);
	
		Logger.console_log(logEvent);
	}

	static getTraceId(len: number): string
	{
		const traceIdStr: string | undefined = getTraceId();

		if (traceIdStr)
			return (`${L(L_RESET)}${" ".repeat(145 - len)}${L(L_ITALIC, L_GREY)}🠒 id: ${traceIdStr}${L(L_RESET)}}`);
		return ("");
	}

	static console_log(level: LogEvent)
	{
		const time = level.date.toISOString().slice(11, 19);
		const description = EVENTS_DESCRIPTIONS[level.code];
		
		if (Logger.process_log_lvl_allows(description.lvl))
		{
			const log: string = `${colors[description.lvl]}[${time}] [${description.lvl.toUpperCase()}] ${L(L_RESET)}${description.log(level.data)}`;
			const len: number = log.length;
			console.log(`${log}${this.getTraceId(len)}`);
			if (level.caller)
				console.log(`\t⤷ ${L(L_ITALIC, L_GREY)}[${level.caller?.file}:${level.caller?.function}:${level.caller?.line}]${L(L_RESET)}`);
		}
	}
}

export const logger = new Logger();