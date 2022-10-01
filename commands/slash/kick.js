const { 
    SlashCommandBuilder,
    EmbedBuilder 
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: ['KickMembers'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a person.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to kick')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason to kick')
            .setRequired(false)),
    async execute(interaction, client) {

        //log
        const commandName = "KICK";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);
        
        const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription('The person you want to kick is above you!')

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        if (!user.kickable) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("The person you want to kick is above me! So I can't kick it.")

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        try {
            if (interaction.options.getString('reason')) {
                user.kick(interaction.options.getString('reason'))
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`**${user.user.tag}** Has been successfully kicked!`)

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            } else {
                user.kick()
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`**${user.user.tag}** Has been successfully kicked!`)

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            };

        } catch(err) {
            const commandName = "kick.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }  
    },
};