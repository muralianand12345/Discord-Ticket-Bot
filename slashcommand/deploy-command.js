const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();

module.exports = {
    name: 'ready',
    execute(client) {
        const clientID = process.env.CLIENT_ID;
        const Token = process.env.TOKEN;

        const slashcommands = [];
        const slashcommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of slashcommandFiles) {
            const command = require(`../commands/${file}`);
            slashcommands.push(command.data.toJSON());
        }

        const rest = new REST({
            version: '10'
        }).setToken(Token);

        rest.put(Routes.applicationCommands(clientID), {
            body: slashcommands
        }).then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
        //console.log(`${slashcommands} Loaded to the Client`);
        slashcommands.forEach( eachcommands => {
            console.log(`${eachcommands.name} has been loaded`);
        });    
    },
};