import
{ readdirSync } from "fs";


const loadCommands = (bot, dir = '../commands') =>
{
    readdirSync(dir).forEach(dirs =>
{
        const commands = readdirSync (`${dir}/${dirs}/`).filter(files => files.endsWith('.ts'));
        
        for (const file of commands)
		{
            const getFileName = require(`${dir}/${dirs}/${file}`);
            bot.commands.set(getFileName.help.name, getFileName);
        };
    
    });
    
    //https://www.youtube.com/watch?v=CkcQKN68LtE&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=11
};


const loadEvents = (bot, dir = '../events') =>
{
    readdirSync(dir).forEach(dirs =>
{
        const events = readdirSync (`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));
        for (const event of events )
{
            const evt = require(`${dir}/${dirs}/${event}`);
            const evName = event.split(".")[0];
            bot.on(evName, evt.bind(null, bot));
    
            //https://www.youtube.com/watch?v=501eQ3kg7JU&list=PLuWyq_EO5_ALOnpxptlqQA5FR75Nza2PQ&index=21
        };
    });
    
};

const loadRoles = (bot, dir = '../rolesCategories') =>
{
    readdirSync(dir).forEach(dirs =>
{
        const rolesCommands = readdirSync (`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));
        
        for (const file of rolesCommands )
{
            const getFileName = require(`${dir}/${dirs}/${file}`);
            bot.rolesCommands.set(getFileName.help.name, getFileName);
        };
    
    });
};


export
{
    loadCommands,
    loadEvents,
    loadRoles,
}