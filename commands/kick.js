const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
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
        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
           
        //log
        const commandName = "KICK";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`},
            { name: "To User", value: `<#${user.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]});
        
        const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (!executer.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription('You do not have the required permission to execute this command! (`KICK_MEMBERS`)')

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

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
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            err_logchan.send({ content: `${errTag}`, embeds: [errEmbed] });
        }  
    },
};