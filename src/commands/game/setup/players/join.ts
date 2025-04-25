import { CONSTANTES } from "../../../../config/constantes.js";
import { Client, Message, Collection } from "discord.js";
import { Player } from "../../../../types/Player.js";
import { Game } from "../../../../types/Game.js";

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

function getPlayer(bot: Client, message: Message): Player
{
	let player = bot.players.get(message.author.id);
	if ( !player )
	{
		player = new Player(message.author.username, message.author.id);
		bot.players.set(player.id, player);
	}
	return ( player );
}

async function isPlayerInGame(player: Player, message: Message,): Promise<boolean>
{
	if ( (player.inGame != null) || (player.waitingRoom != null ))
	{
		// TODO faire un bouton qui te permete de changer de game
		if (player.inGame != null)
			await message.reply(`You are already in a game (${player.inGame.game.guildName} ${player.inGame.game.name}). Please leave it before joining another one.`);
		else
			await message.reply(`You are already in a waiting room (${player.waitingRoom!.guildName} ${player.waitingRoom!.name}). Please leave it before joining another one.`);
		return (true);
	}
	return (false);
}

async function getPlayerGame(player: Player, bot: Client, message: Message, argv: string[]) : Promise<Game | null>
{
	let games: Collection<string, Game> = bot.games.get(message.guild!.id)!;
	let game: Game | undefined;
	if (argv.length > 0)
		game = games.get(argv[0]);
	else
		game = games.find(g => g.isDefaultGame);
	if ( game === undefined )
	{
		let gameName = message.author.username;
		if (argv.length > 0)
			gameName = argv[0];
			

		// TODO privater les attributs et faire des getter
		if (games.has(gameName))
		{
			await message.reply(`A game with the name **${games.get(gameName)!.name}** already exists. Please choose another name.`);
			return (null);
		}
		game = new Game(message.guild!, gameName);
		if ( games.size == 0 )
		{
			game.setDefaultGame(true);
			await message.reply(`The game **${game.name}** has been set as default.`);
		}
		games.set(game.name, game);
	}
	else if ( game.status !== "pending" )
	{
		if (game.waitingRoom.has(player.id))
		{
			await message.reply(`You are already in the waiting room of the game **${game.name}**.`);
			return (null);
		}
		game.addWaitingPlayer(player);
		await message.reply(`The game **${game.name}** has already started. You've been added to the waiting room`);
		return (null);
	}
	return (game);
}

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
	// console.log(message.author);
	// console.log(message.guild);
	
	let player = getPlayer(bot, message);
	if (await isPlayerInGame(player, message))
		return;
	
	
	let game = await getPlayerGame(player, bot, message, argv);
	if ( game === null )
		return;
	
	game.addPlayer(player);
	// console.log(game, player);
	
	await message.reply(`You have joined the game **${game.name}**.`);
}

export const help = CONSTANTES.COMMANDS.GAME.SETUP.PLAYERS.JOIN;

// TODO : gerer waiting room en fonction de connexion vocale (a la fin de la partie, si des gens quittent le vocal, ca enleve la personne par defaut) -> en faire un paramètre modifiable