import type { LgonId, LgonIdKind } from "../../../../../../types/LgonId.js";

export type LgonStatusKind =
	"silenced" |
	"tap" |
	"love";

export type LgonStatus =
{
	kind: LgonStatusKind;
	targets: Set<LgonId<LgonIdKind>>,
}
