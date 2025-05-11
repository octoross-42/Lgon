import { Client, Message, EmbedBuilder } from 'discord.js';
import { BotCommand } from '../../../classes/Commands/BotCommand.js';
import { LgonRoleGenerator } from '../../../classes/LgonRole/LgonRoleGenerator.js';
import { CONSTANTES } from '../../../config/constantes.js';

export async function basic_help(bot: Client, message: Message)
{
	const embed = new EmbedBuilder()
		.setColor('#158373')
		.setTitle("**Help**")
		.addFields( 
			{ name: "**Liste des commandes**", value: `\nPour plus d'informations sur une commande, \`${CONSTANTES.PREFIX} help <command_name>\`\nPour plus d'informations sur un role, \`${CONSTANTES.PREFIX} help <role_name>\``, inline: false },
			// { name: '\u200B', value: '\u200B' }
			// { name: "_________________________________________________", value: '\u200B', inline: false }
	);
	  
	let commandCategory: string | null = null;
	let commandCatergoyContent: string = "";

	for (const command of bot.commands.values())
	{
		// console.log(command);
		if (commandCategory != command.getMainCategory())
		{
			if (commandCategory !== null)
				embed.addFields(
					{	name: commandCategory.toUpperCase(),
						value: commandCatergoyContent,
						inline: true }
				);
			commandCategory = command.getMainCategory();
			commandCatergoyContent = "";
		}
		commandCatergoyContent += `- ${command.name}\n`;
	}
	embed.addFields(
		{	name: commandCategory!.toUpperCase(),
			value: commandCatergoyContent,
			inline: true }
	);

	await message.reply({ embeds: [embed], flags: CONSTANTES.FLAGS });
}

export async function help_roles(bot: Client, message: Message)
{
	const embed = new EmbedBuilder()
		.setColor('#158373')
		.setTitle("Roles")
		.addFields(
			{ name: "**Liste des rôles**", value: `\nPour plus d'informations sur un rôle, tapez \`${CONSTANTES.PREFIX} <role_name>\``, inline: false },
			// { name: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬', value: '\u200B', inline: false }
			// { name: '\u200B', value: '\u200B' }
		);

	let roleCategory: string | null = null;
	let rolesContent: string = "";

	for (const role of bot.roles.values())
	{
		// console.log(role);
		if (roleCategory != role.category)
		{
			if (roleCategory !== null)
				embed.addFields(
					{	name: roleCategory!,
						value: rolesContent,
						inline: true }
				);
			roleCategory = role.category;
			rolesContent = "";
		}
		rolesContent += `- ${role.printName}\n`;
	}
	embed.addFields(
		{	name: roleCategory!,
			value: rolesContent,
			inline: true }
	);

	await message.reply( { embeds: [embed], flags: CONSTANTES.FLAGS });
}

export async function help_role(message: Message, role: LgonRoleGenerator)
{

}

export async function help_command(message: Message, command: BotCommand)
{
	let embed = new EmbedBuilder()
		.setColor('#158373')
		.setTitle("**" + command.name + "**")
		.setDescription(command.description)
	
	embed.addFields({ name: "Utilisation", value: command.usage, inline: command.defaultUsage} );
	if (command.cooldown > 0)
		embed.addFields({ name: "Cooldown", value: `${command.cooldown}sec`, inline: true});
	if (command.aliases.length > 0)
		embed.addFields({ name: "Alias", value: `${command.aliases.join(", ")}`, inline: true});
	await message.reply( { embeds: [embed], flags: CONSTANTES.FLAGS });
}

export async function run(bot: Client, message: Message, argv: string[]): Promise<void>
{
    if (!argv.length)
	{
		await basic_help(bot, message);
		return ;
	}

	if ((argv[0] == "action") || (argv[0] == "roles"))
	{
		await help_roles(bot, message);
		return ;
	}

	const commandName: string = argv[0].toLowerCase();
    const command = bot.commands.get(commandName)
						|| bot.commands.find(cmd => !!cmd.aliases?.includes(commandName));
	if ( command )
	{
		await help_command(message, command);
		return ;
	}
	
	const role = bot.roles.get(commandName)
			|| bot.roles.find(cmd => !!cmd.aliases?.includes(commandName));
	if ( role )
	{
		await help_role(message, role);
		return ;
	}

	// await message.channel.send(`Votre commande n'est pas valide !  (\`${CONSTANTES.PREFIX} help action\` pour afficher les rôles)`);
};

export const help = CONSTANTES.COMMANDS.BOT.DATA.HELP;