const fs = require('fs');

module.exports = {
    name: 'ready',
    execute(client) {

        //slashCommands Read
        const slashcommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

        for (const file of slashcommandFiles) {
            const command = require(`../../commands/slash/${file}`);
            client.commands.set(command.data.name, command);
        };

        //messageCommands Read
        const messagecommandFiles = fs.readdirSync('./commands/message').filter(file => file.endsWith('.js'));

        for (const file of messagecommandFiles) {
            const command = require(`../../commands/message/${file}`);
            client.commands.set(command.name, command);
        };
    }
}