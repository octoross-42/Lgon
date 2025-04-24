import { CONSTANTES } from "../../../../config/constantes.js";
import { Client, Message, Collection } from "discord.js";
import { Player } from "../../../../types/Player.js";
import { Game } from "../../../../types/Game.js";

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	// console.log(message.author);
	// console.log(message.guild);

	let player = bot.players.get(message.author.id);
	if ( player && (player.InGame.game != null) || player.waitingRoom != null )
	{
		if (player.InGame.game != null)
			await message.reply(`You are already in a game (${player.InGame.game.guildName} ${player.InGame.game.name}). Please leave it before joining another one.`);
		else
			await message.reply(`You are already in a waiting room (${player.waitingRoom.guildName} ${player.waitingRoom.name}). Please leave it before joining another one.`);
		return;
	}
	if ( !player )
	{
		player = new Player(message.author.username, message.author.id);
		bot.players.set(player.id, player);
	}

	let games: Collection<string, Game> = bot.games.get(message.guild!.id)!;
	let game: Game | undefined;
	if (argv.length > 0)
		game = games.get(argv[0]);
	else
		game = games.find(g => g.isDefaultGame);
	if ( game === undefined )
	{
		function getTimeString(date: Date = new Date()): string
		{
			const timePart = new Intl.DateTimeFormat('fr', {
			  hour: '2-digit',
			  minute: '2-digit',
			  second: '2-digit',
			  hour12: false
			}).format(date);
			
			return timePart;
		  }
		  
		  // Utilisation
		const time = getTimeString();
		console.log(time);
		// TODO check si name dans le cas de time existe deja
		
		if (argv.length > 0)
			game = new Game(message.guild!, argv[0]);
		else
			game = new Game(message.guild!, time);

		// TODO privater les attributs et faire des getter
		games.set(game.name, game);
		if ( games.size > 0 )
			game.setDefaultGame(true);
	}
	else if ( game.status !== "pending" )
	{
		if (game.waitingRoom.has(player.id))
		{
			await message.reply(`You are already in the waiting room of the game **${game.name}**.`);
			return;
		}
		game.addWaitingPlayer(player);
		await message.reply(`The game **${game.name}** has already started. You've been added to the waiting room`);
		return;
	}
	
	game.addPlayer(player);
	console.log(game, player);
	
	await message.reply(`You have joined the game **${game.name}**.`);
}

export const help = CONSTANTES.COMMANDS.GAME.SETUP.PLAYERS.JOIN;

// TODO : gerer waiting room en fonction de connexion vocale (a la fin de la partie, si des gens quittent le vocal, ca enleve la personne par defaut) -> en faire un paramètre modifiable