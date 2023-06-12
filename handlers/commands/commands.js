const fs = require('fs');

const {
    Events,
    Collection
} = require('discord.js');

const messageCommands = new Collection();
const slashCommands = new Collection();

module.exports = {
    name: Events.ClientReady,
    execute(client) {

        const messageCommandFiles = fs.readdirSync('./commands/message').filter(file => file.endsWith('.js'));

        for (const file of messageCommandFiles) {
            const command = require(`../../commands/message/${file}`);
            messageCommands.set(command.name, command);
        }

        const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

        for (const file of slashCommandFiles) {
            const command = require(`../../commands/slash/${file}`);
            slashCommands.set(command.data.name, command);
        }

        client.messageCommands = messageCommands;
        client.slashCommands = slashCommands;
    }
}