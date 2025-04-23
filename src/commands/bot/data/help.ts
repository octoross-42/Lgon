import { Client, Message, MessageEmbed, Role } from 'discord.js';
import { Command } from '../../../types/Command.js';
import { CONSTANTES } from '../../../config/constantes.js';

function basic_help(bot: Client, message: Message)
{
	const embed = new MessageEmbed()
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
		console.log(command);
		if (commandCategory != command.category[0])
		{
			if (commandCategory !== null)
				embed.addFields(
					{	name: commandCategory.toUpperCase(),
						value: commandCatergoyContent,
						inline: true }
				);
			commandCategory = command.category[0];
			commandCatergoyContent = "";
		}
		commandCatergoyContent += `- ${command.name}\n`;
	}
	embed.addFields(
		{	name: commandCategory!.toUpperCase(),
			value: commandCatergoyContent,
			inline: true }
	);

	return message.channel.send(embed);
}

function help_roles(bot: Client, message: Message)
{
	const embed = new MessageEmbed()
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
		console.log(role);
		if (roleCategory != role.category[0])
		{
			if (roleCategory !== null)
				embed.addFields(
					{	name: roleCategory,
						value: rolesContent,
						inline: true }
				);
			roleCategory = role.category[0];
			rolesContent = "";
		}
		rolesContent += `- ${role.name[0].toUpperCase()}${role.name.slice(1)}\n`;
	}
	embed.addFields(
		{	name: roleCategory,
			value: rolesContent,
			inline: true }
	);

	return message.channel.send(embed);
}

function help_role(message: Message, role: Role)
{

}

function help_command(message: Message, command: Command)
{
	let embed = new MessageEmbed()
		.setColor('#158373')
		.setTitle("**" + command.name + "**")
		.setDescription(command.description)
	
	embed.addField("Utilisation", command.usage, command.defaultUsage);
	if (command.cooldown > 0)
		embed.addField("Cooldown", `${command.cooldown}sec`, true);
	if (command.aliases.length > 0)
		embed.addField("Alias", `${command.aliases.join(", ")}`, true);
	message.channel.send(embed);
}

export function run(bot: Client, message: Message, argv: string[]): Promise<void> | void
{
    if (!argv.length)
	{
		basic_help(bot, message);
		return ;
	}

	if ((argv[0] == "action") || (argv[0] == "roles"))
	{
		help_roles(bot, message);
		return ;
	}

	const commandName: string = argv[0].toLowerCase();
	console.log(commandName);
    const command = bot.commands.get(commandName)
						|| bot.commands.find(cmd => !!cmd.aliases?.includes(commandName));
	console.log(command);
	if ( command )
	{
		help_command(message, command);
		return ;
	}
	
	const role = bot.roles.get(commandName)
			|| bot.roles.find(cmd => !!cmd.aliases?.includes(commandName));
	console.log(role);
	if ( role )
	{
		help_role(message, role);
		return ;
	}

	// message.channel.send(`Votre commande n'est pas valide !  (\`${CONSTANTES.PREFIX} help action\` pour afficher les rôles)`);
};

export const help = CONSTANTES.COMMANDS.BOT.DATA.HELP;