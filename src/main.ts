import { bootstrap } from './bootstrap.js';


// process.on("unhandledRejection", (reason) => {
// 	// logger.error("Unhandled rejection:", reason);
//   // log + éventuellement restart propre
// });

// process.on("uncaughtException", (err) => {
// //   logger.error("Uncaught exception:", err);
// 	process.exit(1);
// });

bootstrap().catch((err) =>
{
	console.error('Fatal error during bootstrap', err);
	process.exit(1);
});
