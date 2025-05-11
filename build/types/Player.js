import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { Game, getGame } from "./Game.js";
// TODO afficher joueurs par nickname et premier arrive premier servi + faire commande pour refresh nickname / changer nickname
export function getPlayer(bot, user, createPLayer = true) {
    let player = bot.players.get(user.username);
    if (!player) {
        if (createPLayer) {
            // TODO: ajouter ajout message si c'est message final et parametre joueur (exemple join -> truc join truc direct et pas partie created etc)
            // console.log(user);
            player = new Player(user.username, user.id, user.dmChannel, user.globalName);
            bot.players.set(player.name, player);
        }
        else
            return (null);
    }
    return (player);
}
function askToChangeGame(bot, guild, gameToJoinName, embed, components) {
    console.log("askToChangeGame");
    embed.addFields({ name: '**?**', value: "Do you want to change game ?", inline: false });
    if (gameToJoinName === null)
        gameToJoinName = bot.games.get(guild.id).find(game => game.isDefaultGame)?.name;
    const button = new ButtonBuilder()
        .setCustomId('change_game ' + gameToJoinName)
        .setLabel(`Join ${gameToJoinName}`)
        .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder()
        .addComponents(button);
    components.push(row);
}
export class Player {
    id;
    name;
    game;
    waitingRoom;
    // historic: Game[]; // TODO creer class game record
    askConfirmation;
    tellError;
    nickname;
    dm;
    ready;
    constructor(name, id, dm, nickname) {
        // this.historic = [];
        this.id = id;
        this.nickname = nickname;
        console.log(this.nickname);
        this.dm = dm;
        this.ready = false;
        this.name = name;
        this.game = null;
        this.waitingRoom = null;
        this.askConfirmation = true;
        this.tellError = true;
    }
    getGame() {
        if (this.game !== null)
            return (this.game);
        if (this.waitingRoom !== null)
            return (this.waitingRoom);
        return (null);
    }
    setReady(ready) {
        this.ready = ready;
    }
    joinGame(bot, guild, gameToJoinName, askToChange, embed, components) {
        let gameToJoin = getGame(bot, guild, gameToJoinName);
        let playerGame = this.getGame();
        if (playerGame !== null) {
            if (playerGame === gameToJoin) {
                if (this.tellError) {
                    if (this.game !== null)
                        embed.addFields({ name: '**Error**', value: `You are already in this game`, inline: false });
                    else if (this.waitingRoom !== null)
                        embed.addFields({ name: '**Error**', value: `You are already in the waiting room of this game`, inline: false });
                }
                return;
            }
            if (this.askConfirmation && askToChange)
                return askToChangeGame(bot, guild, gameToJoinName, embed, components);
            if (!this.leaveGame(bot, embed))
                return;
        }
        if (!gameToJoin) {
            let games = bot.games.get(guild.id);
            if (!gameToJoinName)
                gameToJoinName = this.name;
            gameToJoin = new Game(guild, gameToJoinName);
            embed.addFields({ name: '**Game**', value: `The game **${gameToJoin.name}** has been created`, inline: false });
            if (games.size === 0) {
                gameToJoin.setDefaultGame(true);
                embed.addFields({ name: '**Default**', value: `The game **${gameToJoin.name}** has been set as default`, inline: false });
            }
            gameToJoin.addPlayer(this, embed);
            games.set(gameToJoin.name, gameToJoin);
        }
        else if (gameToJoin.status !== "setup")
            gameToJoin.addWaitingPlayer(this, embed);
        else
            gameToJoin.addPlayer(this, embed);
        this.game = gameToJoin;
    }
    leaveGame(bot, embed) {
        if ((this.waitingRoom === null) && (this.game === null)) {
            if (this.tellError)
                embed.addFields({ name: '**Error**', value: `Yo're not in any game`, inline: false });
            return (true);
        }
        if (this.game?.status !== "setup") {
            embed.addFields({ name: '**No**', value: `You can't leave a game that has already started`, inline: false });
            return (false);
        }
        if (this.game !== null) {
            this.game.removePlayer(bot, this, embed);
            this.game = null;
        }
        else {
            this.waitingRoom.removeWaitingPlayer(this, embed);
            this.waitingRoom = null;
        }
        return (true);
    }
}
