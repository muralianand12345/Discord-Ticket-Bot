const wait = require('util').promisify(setTimeout);
const cooldown = new Set();
const cooldownTime = 60000; 
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try{
        
                                                                 
        } catch(err) {
            const commandName = "interactionPurge.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }
    }
}