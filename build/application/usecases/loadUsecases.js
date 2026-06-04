import { UsecasesRegistry } from '../context/modules/UsecasesRegistry.js';
import { CreateGameUsecase } from '../usecases/lobby/CreateGame.usecase.js';
import { StartGameUsecase } from '../usecases/lobby/StartGame.usecase.js';
export function loadUsescases(gameStore, userStore, flowRunner, logger) {
    return new UsecasesRegistry({
        "CreateGame": new CreateGameUsecase(gameStore, userStore, flowRunner, logger),
        "StartGame": new StartGameUsecase(gameStore, userStore, flowRunner, logger)
    }, logger);
}
;
