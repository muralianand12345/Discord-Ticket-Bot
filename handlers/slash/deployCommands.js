var colors = require('colors/safe');
const fs = require('fs');
const { 
    REST, 
    Routes 
} = require('discord.js');
require("dotenv").config();

module.exports = {
    name: 'ready',
    execute(client) {
        const clientID = process.env.CLIENT_ID;
        const Token = process.env.TOKEN;

        const slashcommands = [];
        const slashcommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

        for (const file of slashcommandFiles) {
            const command = require(`../../commands/slash/${file}`);
            slashcommands.push(command.data.toJSON());
        }

        const rest = new REST({
            version: '10'
        }).setToken(Token);

        rest.put(Routes.applicationCommands(clientID), {
            body: slashcommands
        }).then(() => console.log(colors.green('Successfully registered application commands.')))
        .catch( err => {
            console.log(colors.red(err));
        });
        slashcommands.forEach( eachcommands => {
            console.log(colors.blue(`${eachcommands.name} has been loaded`));
        });    
    },
};