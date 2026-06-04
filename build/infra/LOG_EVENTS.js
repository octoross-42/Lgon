export const LOG_LEVELS = ["debug", "info", "warning", "error"];
export const defaultLogLvl = "info";
export const EVENTS_DESCRIPTIONS = {
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
        log: d => `${d?.userId} run: '${d?.command}' with args '${(d?.args).join(" ")}'`
    },
    COMMAND_FAIL: {
        lvl: "debug",
        audience: "system",
        log: d => `${d?.userId} tried to run: '${d?.command}' with args '${(d?.args).join(" ")}' but failed because command ${d?.reason}`
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
};
