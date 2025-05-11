import { Collection } from "discord.js";
import { getRoleName } from "../../classes/LgonRole/LgonRoleGenerator.js";
import { LgonEmbed } from "../Embed/LgonEmbed.js";
import { CONSTANTES } from "../../config/constantes.js";
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
    ready;
    rolesCount;
    isDefaultGame = false;
    static games_nbr = 0;
    status;
    players; // userId -> InGame
    roles;
    waitingRoom; // userId -> InGame
    inGameRoles;
    center;
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
        this.inGameRoles = null;
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
        this.ready = 0;
        this.rolesCount = 0;
        this.center = null;
    }
    addReady(message) {
        this.ready++;
    }
    rmReady(message) {
        this.ready--;
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
        this.waitingRoom.set(player.name, player);
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
        this.rolesCount += addNbr;
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
    async distributeRoles(bot) {
        this.inGameRoles = [];
        let rolesOrder = CONSTANTES.ROLES_ORDER;
        let i = 0;
        let roleId = 0;
        let tmpPlayers = Array.from(this.players.values());
        let tmpCenter = ["left", "middle", "right"];
        this.center = new Collection();
        while (i < rolesOrder.length) {
            const role = rolesOrder[i].toLowerCase();
            if (this.roles.has(role)) {
                const roleCount = this.roles.get(role);
                const roleGen = bot.roles.get(role);
                let j = 0;
                while (j < roleCount) {
                    let lgonRole;
                    if ((Math.floor(Math.random() * (this.rolesCount)) < tmpCenter.length) || (tmpPlayers.length === 0)) {
                        const index = Math.floor(Math.random() * tmpCenter.length);
                        lgonRole = roleGen.generateRole(tmpCenter[index], roleId);
                        this.center.set(tmpCenter[index], lgonRole);
                        tmpCenter.splice(index, 1);
                    }
                    else {
                        const index = Math.floor(Math.random() * tmpPlayers.length);
                        lgonRole = roleGen.generateRole(tmpPlayers[index], roleId);
                        await tmpPlayers[index].sendRole(lgonRole);
                        tmpPlayers.splice(index, 1);
                    }
                    this.inGameRoles.push(lgonRole);
                    j++;
                    roleId++;
                }
            }
            i++;
        }
    }
    async start(bot, message) {
        const linkImage = "https://i.imgur.com/m3SG4PB.png";
        let embed = LgonEmbed.newEmbed();
        embed.setTitle(this.name);
        embed.setThumbnail(linkImage);
        embed.addFields({ name: "Game has started !", value: "Each player will receieve its role in DM" });
        await message.reply({ embeds: [embed] });
        await this.distributeRoles(bot);
    }
}
