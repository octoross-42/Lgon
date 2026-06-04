import { UsecasesRegistry } from 'application/context/modules/UsecasesRegistry.js';
import type { Logger } from 'infra/Logger.js';

import { CreateGameUsecase } from 'application/usecases/lobby/CreateGame.usecase.js';
import { StartGameUsecase } from 'application/usecases/lobby/StartGame.usecase.js';
import type { GameStore } from 'application/context/modules/GameStore.js';
import type { UserStore } from 'application/context/modules/UserStore.js';
import type { FlowRunner } from 'application/messaging/model/FlowRunner.js';

export function loadUsescases(gameStore: GameStore, userStore: UserStore, flowRunner: FlowRunner, logger: Logger): UsecasesRegistry
{
	return new UsecasesRegistry({
		"CreateGame": new CreateGameUsecase(gameStore, userStore, flowRunner, logger),
		"StartGame": new StartGameUsecase(gameStore, userStore, flowRunner, logger)
	}, logger);
};
