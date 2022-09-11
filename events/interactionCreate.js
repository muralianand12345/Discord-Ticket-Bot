module.exports = {
	name: 'interactionCreate',
	execute: async(interaction, client) => {

        //if (!interaction.type === InteractionType.ApplicationCommand) return
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
    
        try {
            config = client.config;
            await command.execute(interaction, client, config);
        } catch(error) { //auto error  
            global.console.log(error);
            return interaction.reply({
                content: `An **ERROR** occured! Kindly Contact - ${client.config.ERR_LOG.ERR_TAG}`,
                ephemeral: true
            });
        };
    }
}