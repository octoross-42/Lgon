import { Collection } from "discord.js";
import { getRoleName } from "./LgonRoleGenerator.js";
import { AwaitingInteraction, AwaitingInteractionType } from "./AwaitingInteraction.js";
import { CONSTANTES } from "../config/constantes.js";
export function getGame(bot, guild, gameName, newGameName = null, createGame = false) {
    let game;
    if (gameName)
        game = bot.games.get(guild.id).get(gameName);
    else
        game = bot.games.get(guild.id).find(g => g.isDefaultGame);
    if (!game && createGame) {
        if (gameName)
            game = new Game(guild, gameName);
        else if (newGameName)
            game = new Game(guild, newGameName);
        else
            return (null);
        bot.games.get(guild.id).set(game.name, game);
    }
    return (game || null);
}
export class Game {
    name;
    guildId;
    guildName;
    time;
    date;
    id;
    isDefaultGame = false;
    static games_nbr = 0;
    status;
    players; // userId -> InGame
    roles;
    waitingRoom; // userId -> InGame
    constructor(guild, name) {
        // TODO GERER LES OVERFLOW D'ids
        const date = new Date();
        this.time = new Intl.DateTimeFormat('fr', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
        this.date = new Intl.DateTimeFormat('fr', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date());
        this.guildId = guild.id;
        this.guildName = guild.name;
        Game.games_nbr++;
        this.id = Game.games_nbr;
        this.name = name;
        this.status = "setup";
        this.players = new Collection();
        this.waitingRoom = new Collection();
        this.roles = new Collection();
        this.isDefaultGame = false;
    }
    setDefaultGame(isDefault) {
        this.isDefaultGame = isDefault;
    }
    addPlayer(player, embed) {
        // console.log("add player", player.name, this.name);
        this.players.set(player.name, player);
        embed.addFields({ name: '**Join**', value: `${player.name} has joined **${this.name}**`, inline: false });
    }
    addWaitingPlayer(player, embed) {
        this.waitingRoom.set(player.id, player);
        embed.addFields({ name: '**Join**', value: `${player.name} has joined **${this.name}**'s waiting room`, inline: false });
    }
    removePlayer(bot, player, embed) {
        this.players.delete(player.name);
        embed.addFields({ name: '**Leave**', value: `${player.name} has left **${this.name}**`, inline: false });
        if (this.players.size === 0) {
            let games = bot.games.get(this.guildId);
            games.delete(this.name);
            embed.addFields({ name: '**Delete**', value: `Game **${this.name}** has no player left, it has been destroyed`, inline: false });
            if (games.size === 1) {
                const game = games.first();
                game.setDefaultGame(true);
                embed.addFields({ name: '**Default**', value: `Game **${game.name}** has been set to default`, inline: false });
            }
        }
    }
    removeWaitingPlayer(player, embed) {
        this.waitingRoom.delete(player.name);
        embed.addFields({ name: '**Leave**', value: `${player.name} has left **${this.name}**'s waiting room`, inline: false });
    }
    // sortRoles()
    // {
    // 	let rolesOrder: string[] = CONSTANTES.ROLES_ORDER;
    // 		let o: number = 0, r: number = 0;
    // 		let inserted: boolean = false;
    // 		while ((r < this.roles.length) && !inserted)
    // 		{
    // 			while (this.roles[r].name != rolesOrder[o])
    // 			{
    // 				if (this.roles[r].name == roleRealName.name)
    // 				{
    // 					for (let i = 0; i < addNbr; i++)
    // 						this.roles.splice(r, 0, roleRealName);
    // 					inserted = true;
    // 					break ;
    // 				}
    // 				o ++;
    // 			}
    // 			r ++;
    // 		}
    // 		if (!inserted)
    // 		{
    // 			for (let i = 0; i < addNbr; i++)
    // 				this.roles.push(roleRealName);
    // 		}
    // }
    addRole(bot, roleName, addNbr, embed) {
        let roleRealName = getRoleName(bot, roleName);
        if (!roleRealName) {
            embed.addFields({ name: '**Error**', value: `Role **${roleName}** does not exist`, inline: false });
            return;
        }
        if (this.roles.has(roleRealName)) {
            let roleCount = this.roles.get(roleRealName);
            roleCount += addNbr;
        }
        else
            this.roles.set(roleRealName, addNbr);
        embed.addFields({ name: `**Roles**`, value: `Added **${addNbr}** ${roleRealName}`, inline: false });
    }
    showPlayers(embed, showReady = false) {
        let playersString = "";
        this.players.forEach((player) => {
            playersString += player.name;
            if (showReady) {
                if (player.ready)
                    playersString += " ✅";
                else
                    playersString += " ❌";
            }
            playersString += "\n";
        });
        if (playersString.length > 0)
            embed.addFields({ name: `**Players**`, value: playersString, inline: true });
        else
            embed.addFields({ name: `**Players**`, value: "No players", inline: true });
    }
    showRoles(embed) {
        let rolesString = "";
        for (const role of this.roles) {
            // console.log(role);
            if (role[1] > 1)
                rolesString += role[1] + " ";
            rolesString += role[0] + "\n";
        }
        if (rolesString.length > 0)
            embed.addFields({ name: `**Roles**`, value: rolesString, inline: true });
        else
            embed.addFields({ name: `**Roles**`, value: "No roles", inline: true });
    }
    async startConfirmation(bot, message) {
        // const collector = new ReactionCollector(message, { filter: (reaction, user) => {
        // 	return (true || (reaction.emoji.name === "✅") || (reaction.emoji.name === "❌"))}});
        // collector.on('collect', async (reaction, user) =>
        // 	{
        // 		console.log("hehehehe");
        // 	});
        let waitConfirm = new AwaitingInteraction(AwaitingInteractionType.START, this, message.id);
        bot.awaitingInteractions.set(message.id, waitConfirm);
        await message.react("✅");
        await message.react("❌");
        console.log("startConfirmation", message.id);
    }
    start(bot, askConfirmation, embed) {
        let rolesCount = 0;
        this.roles.forEach((role) => { rolesCount += role; });
        let error = "";
        if (this.players.size < CONSTANTES.MIN_NBR_PLAYERS)
            error += "Not enough players to start the game";
        if (this.players.size !== rolesCount - 3)
            error += `Not enough roles (${rolesCount}) for the players (${this.players.size})\nThere needs to be 3 more roles than players to play : ${rolesCount}/${this.players.size + 3}`;
        if (this.status !== "setup")
            error += "The game has already started";
        if (error.length > 0) {
            embed.addFields({ name: '**Error**', value: error, inline: false });
            return (false);
        }
        if (askConfirmation) {
            embed.setTitle(`**Start ${this.name}**`);
            this.showRoles(embed);
            this.showPlayers(embed, true);
            return (true);
        }
        else {
            return (false);
        }
        return (false);
    }
}
