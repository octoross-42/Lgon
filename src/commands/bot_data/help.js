const
{ CONSTANTES } = require ("../../../config/constantes.js");
const categoryCommands = readdirSync ("../commands");

const
{ MessageEmbed } = require ("discord.js");
const
{ readdirSync } = require("fs");

const categoryRoles = readdirSync ("./rolesCategories");

module.exports.run = (bot, message, argsMessage) =>
{

    if (!argsMessage.length)
	{
        const embed = new MessageEmbed()
            .setColor('#158373')
            .setTitle("Help")
            .addFields( 
            	{ name: "Liste des commandes", value: `\nPour plus d'informations sur une commande, tapez \`${CONSTANTES.PREFIX}help <command_name>\` `, inline: false },
				{ name: '\u200B', value: '\u200B' }
			);

        for (const category of categoryCommands)
		{
            embed.addFields(
               { name: `${category}`, value: `- ${bot.commands.filter(cat => cat.help.category === category.toLowerCase()).map
                    (cmd => cmd.help.name).join('\n - ') }`, inline: true }
			);
        };

        return message.channel.send(embed);
    }

    else
	{

        if (argsMessage[0] === "action")
		{
            const embed = new MessageEmbed()
                    .setColor('#158373')
                    .setTitle("Action")
                    .setDescription(`Informations des actions des différents rôles`)
                    .addFields(
						{ name: "Liste des rôles :", value: `\nPour plus d'informations sur un rôle, tapez \`${CONSTANTES.PREFIX}help <role_name>\` `, inline: false },
						{ name: '\u200B', value: '\u200B' }
					);

            for (const category of categoryRoles)
			{
                    embed.addFields(
						{ name: `${category}`, value: `- ${bot.rolesCommands.filter(cat => cat.help.category === category.toLowerCase()).map
                            (role => `${role.help.name[0].toUpperCase()}${role.help.name.slice(1, role.help.name.length)}`
                                    ).join('\n - ') }`, inline: true } 
                    );
                };

            return message.channel.send(embed);
        }


        else
		{
            var commandName = argsMessage[0].toLowerCase();
            var command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));
            if (command === undefined )
			{
                var boolCommand = false;
                var i = 1;
                while ( !boolCommand && i <= argsMessage.length)
				{
                    commandName = argsMessage[0];
                    for (var j = 1; j < i; j++ )
					    commandName = `${commandName} ${argsMessage[j]}`;
                    
					command = bot.rolesCommands.get(commandName.toLowerCase()) || bot.rolesCommands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName.toLowerCase()));

                    if (command) boolCommand = true;
                    i +=1;
                }
            }
            if (command === undefined )
			    message.channel.send(`Votre commande n'est pas valide !  (\`${CONSTANTES.PREFIX}help action\` pour afficher les rôles)`);
            
            else
			{
                const titres = command.help.name.split( " ");
                var titresI = new Array();
                for (var i = 0; i < titres.length; i ++){
                    const titrei1 = titres[i][0].toUpperCase();
                    const titrei2 = titres[i].slice(1, titres[i].length);
                    titresI.push(`${titrei1}${titrei2}`);

                }
                const titre = titresI.join(" ");

                var typeRole = new String();
                if (command.help.typeRole )
				{
                    if (command.help.typeRole[0].length) typeRole = `${typeRole}\n${command.help.typeRole[0]}`;
                    if (command.help.typeRole[1].length) typeRole = `${typeRole}\n${command.help.typeRole[1]}`;
                    if (command.help.typeRole[2].length) typeRole = `${typeRole}\n${command.help.typeRole[2]}`;
                }

                var boolUtilisation = false;
                var tempsStr = "seconde";
                if (command.help.cooldown)
				{
                    boolUtilisation = true;
                    if (command.help.cooldown > 1) tempsStr = `secondes`;
                }

                const embed = new MessageEmbed()
                    .setColor('#158373')
                    .setTitle(titre)
                    .setDescription(`${command.help.description}`)
                    //.addFields({ name: '\u200B', value: '\u200B' },
                    //)
                    if (command.help.usage.length )
						embed.addField("Utilisation", command.help.usage, boolUtilisation);
                    if (command.help.cooldown )
						embed.addField("Cooldown", `${command.help.cooldown} ${tempsStr}`, true);
                    if (command.help.aliases.length > 1)
						embed.addField("Alias", `${command.help.aliases.join(", ")}`, true);
                    if (command.help.cdv)
						embed.addField("Condition de victoire", command.help.cdv, true);
                    if (typeRole.length)
						embed.addField("Type", typeRole, true);

                return message.channel.send(embed);
            }
        };   
    }
};

module.exports.help = CONSTANTES.COMMANDS.BOT_DATA.HELP;