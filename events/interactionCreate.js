const {
    EmbedBuilder,
    Collection,
    PermissionsBitField
} = require('discord.js');
const cooldown = new Collection();
const ms = require('ms');

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {

        //if (!interaction.type === InteractionType.ApplicationCommand) return
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            if (command) {
                if (command.cooldown) {

                    if (cooldown.has(`${command.name}${interaction.user.id}`)) {
                        var coolMsg = client.config.MESSAGE["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${command.name}${interaction.user.id}`) - Date.now(), { long: true }));
                        const coolEmbed = new EmbedBuilder()
                            .setDescription(`${coolMsg}`)
                            .setColor('Red')
                        return interaction.reply({ embeds: [coolEmbed], ephemeral: true });
                    }

                    //userPermission
                    if (command.userPerms || command.botPerms) {
                        if (!interaction.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(`🚫 <@${interaction.user.id}>, You don't have \`${command.userPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return interaction.reply({ embeds: [userPerms], ephemeral: true });
                        }

                        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(`🚫 <@${interaction.user.id}>, I don't have \`${command.botPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return interaction.reply({ embeds: [botPerms], ephemeral: true });
                        }
                    }

                    //cooldown
                    config = client.config;
                    await command.execute(interaction, client, config);
                    cooldown.set(`${command.name}${interaction.user.id}`, Date.now() + command.cooldown)
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${interaction.user.id}`)
                    }, command.cooldown);

                } else {

                    if (command.userPerms || command.botPerms) {
                        if (!interaction.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
                            const userPerms = new EmbedBuilder()
                                .setDescription(`🚫 <@${interaction.user.id}>, You don't have \`${command.userPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return interaction.reply({ embeds: [userPerms], ephemeral: true });
                        }

                        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
                            const botPerms = new EmbedBuilder()
                                .setDescription(`🚫 <@${interaction.user.id}>, I don't have \`${command.botPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return interaction.reply({ embeds: [botPerms], ephemeral: true });
                        }
                    }
                    config = client.config;
                    await command.execute(interaction, client, config);
                }
            }
        } catch (error) {
            global.console.log(error);
            const botErrorEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('An Internal **Error** Occurred, Kindly Contact The Bot Developers!')
            return interaction.reply({
                embeds: [botErrorEmbed],
                ephemeral: true
            });
        }

        /*try {
            config = client.config;
            await command.execute(interaction, client, config);
        } catch(error) { //auto error  
            global.console.log(error);
            return interaction.reply({
                content: `An **ERROR** occured! Kindly Contact - ${client.config.ERR_LOG.ERR_TAG}`,
                ephemeral: true
            });
        };*/
    }
}