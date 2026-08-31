export const VIEW_NOT_FOUND = 1;

export const InteractionCodes = {
	OK: -1,
	GAME_NOT_FOUND: 0,
	ROLE_NOT_FOUND: 1,
	VIEW_NOT_FOUND: 100,
	DISCORD_COMPONENT_NOT_FOUND: 200,
	DISCORD_COMPONENT_DESIGN_ERROR: 201,
} as const;

export type InteractionCode = typeof InteractionCodes[keyof typeof InteractionCodes];
