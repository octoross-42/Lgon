import { CONSTANTES } from "../../../../config/constantes.js";
import { Player, getPlayer } from "../../../../classes/Game/Player.js";
import { LgonRoleGenerator } from "../../../../classes/LgonRole/LgonRoleGenerator.js";
import { Game } from "../../../../classes/Game/Game/Game.js";

import { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";

// TODO faire un truc de messages deja review, pour pouvoir review les messages modifies non reviews

// TODO transformer cette commande en commande mixte pour ajouter role ou joueur (ou inviter idk)

function addWarning(warningCount: number, warning: string): string
{
	let error: string = warning;
	if (warningCount > 1)
		error += " (x" + warningCount + "!".repeat(warningCount) + ")";
	error += '\n';
	return (error);
}

function	addRoles(bot: Client, game: Game, argv: string [], embed: EmbedBuilder, warning: boolean = true): void
{
	let i: number = 0;
	let parsed: [ LgonRoleGenerator, number][] = [];
	let tmpRoleCount = 0;
	let errorNegative: number = 0;
	let errorFloat: number = 0;
	let errorConsecutive: number = 0;

	while (i < argv.length)
	{
		argv[i] = argv[i].replace(",", "");
		argv[i] = argv[i].replace("+", "");
		if ((argv[i] === "and") || (argv[i] === "") || (argv[i] == "et"))
			argv.splice(i, 1);
		else
		{
			let int: number = parseInt(argv[i]);
			if (!isNaN(int))
			{
				if (int < 0)
					errorNegative ++;
				else if (int != parseFloat(argv[i]))
					errorFloat ++;
				else
				{
					if (tmpRoleCount != 0)
						errorConsecutive ++;
					tmpRoleCount = int;
				}
			}
			else
			{
				if (tmpRoleCount === 0)
					tmpRoleCount = 1;
				game.addRole(bot, argv[i], tmpRoleCount, embed);
				tmpRoleCount = 0;
			}
			i ++;
		}
	}
	if (warning)
	{
		let error: string = "";
		if (tmpRoleCount !== 0)
			error += "We need a role with the number you give (" + tmpRoleCount + ")\n";
		if (errorConsecutive)
			error += addWarning(errorConsecutive, "You can't add a negative number of roles (following role will be ignored)");
		else if (errorFloat)
			error += addWarning(errorFloat, "Why you do that... you cant add half a role or whatever... (added the round part)");
		else if (errorNegative)
			error += addWarning(errorNegative, "Of two consecutive number, only the last one will be used... why... why...");
		if (error.length)
			embed.addFields({ name: "Warning", value: error });
	}
}

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{

	let embed = new EmbedBuilder()
			.setColor('#158373');
			// TODO laisser join pour un autre joueur (faire des authorisation de joueur a joueur pour modifier leurs parties), au moins les inviter
	
	let embedComponents: ActionRowBuilder<ButtonBuilder>[] = [];
	let player: Player | null = getPlayer(bot, message.author, false);

	if ( !player || (player.game === null) )
	{
		embed.setTitle("Add");
		// TODO creer une game si pas de game
		embed.addFields( { name: "**Error**", value: "You need to be activly in a game to add roles", inline: false });
		await message.reply(
		{
			embeds: [embed],
			flags: CONSTANTES.FLAGS,
		});
		return ;
	}
	embed.setTitle(`**Game ${player.game!.name}**`);
	
		
	if ( player.game!.phase !== "setup")
	{
		embed.addFields( { name: "**Error**", value: "You can only add roles in setup phase", inline: false });
		await message.reply(
		{
			embeds: [embed],
			flags: CONSTANTES.FLAGS,
		});
		return ;
	}

	if ( player.game!.guildId !== message.guild!.id)
	{
		embed.addFields( { name: "**Error**", value: "You can only add roles in the guild where your game proceeds", inline: false });
		await message.reply(
		{
			embeds: [embed],
			flags: CONSTANTES.FLAGS,
		});
		return ;
	}

	addRoles(bot, player.game!, argv, embed, player.tellError);
	
	if ( !embed.data.fields || (embed.data.fields!.length === 0) )
		return ;

	await message.reply(
	{
		embeds: [embed],
		components: embedComponents,
		flags: CONSTANTES.FLAGS,
	});
		
}

export const meta =
{
	name : "add_roles",
	description : "ajoute des rôles à la composition",
	nbrArgsRequired : 1,
	cooldown: 0,
	where: "guild",
	aliases: ["add_roles", "add"], 
	usage : `\`${CONSTANTES.PREFIX} add_roles\` \`quantité du rôle ajouté\` \`role_name\``,
};