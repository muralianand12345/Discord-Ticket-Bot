const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    ChannelType 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('VP Announcement')
        .addChannelOption(
            option =>
            option.setName('channelid')
            .setDescription('Channel you want to send!')
            .setRequired(true)
        )
        .addStringOption(
            option =>
            option.setName('text')
            .setDescription('Announcements')
            .setRequired(true)
        ),

    async execute(interaction, client) {

        const annnouceText = interaction.options.getString('text');
        const annchannel = interaction.options.getChannel('channelid'); 

        const commandName = "ADD";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        if (annchannel.type !== ChannelType.GuildText) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription('Select only TEXT Channel!')

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        const User = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        const Guild_1 = client.config.ANNOUNCE.GUILD_1.ID;
        const Guild_2 = client.config.ANNOUNCE.GUILD_2.ID;

        if (interaction.guild.id == Guild_1) {

            const Method = client.config.ANNOUNCE.GUILD_1.METHOD;
            if ( Method == "ID") {

                const Role_Id = client.config.ANNOUNCE.GUILD_1.ROLE.ID;
                const Role_Name = client.config.ANNOUNCE.GUILD_1.ROLE.NAME;

                if (User.roles.cache?.has(Role_Id)) {

                    try {
                        client.channels.cache.get(annchannel.id).send({ content: annnouceText })
                        const ReplyEmbed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription('Announcement Has Been Sent to the Specified Channel')

                        return interaction.reply({
                            embeds: [ReplyEmbed],
                            ephemeral: true
                        });

                    } catch(err) {
                        const commandName = "announce.js";
                        const Line = "Catch Error";
                        return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
                    }
                } else {
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You do not have ${Role_Name} Role`)

                    return interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                }

            } else if ( Method == "PERMS") {

                const Perms = client.config.ANNOUNCE.GUILD_1.PERMS;

                if (User.permissions.has(Perms)) {

                    client.channels.cache.get(annchannel.id).send({ content: annnouceText })
                    const ReplyEmbed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription('Announcement Has Been Sent to the Specified Channel')

                        return interaction.reply({
                            embeds: [ReplyEmbed],
                            ephemeral: true
                        });

                } else {
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You do not have the required permission \`${Perms}\`.`)

                    return interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                }
            } else {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Unknown Error.`)

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            }

        } else if (interaction.guild.id == Guild_2) {

            const Method = client.config.ANNOUNCE.GUILD_2.METHOD;
            if ( Method == "ID") {

                const Role_Id = client.config.ANNOUNCE.GUILD_2.ROLE.ID;
                const Role_Name = client.config.ANNOUNCE.GUILD_2.ROLE.NAME;

                if (User.roles.cache?.has(Role_Id)) {

                    try {
                        client.channels.cache.get(annchannel.id).send({ content: annnouceText })
                        const ReplyEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription('Announcement Has Been Sent to the Specified Channel')

                        return interaction.reply({
                            embeds: [ReplyEmbed],
                            ephemeral: true
                        });

                    } catch(err) {
                        const commandName = "announce.js";
                        const Line = "Catch Error";
                        return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
                    }
                } else {
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You do not have ${Role_Name} Role`)

                    return interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                }

            } else if ( Method == "PERMS") {

                const Perms = client.config.ANNOUNCE.GUILD_2.PERMS;

                if (User.permissions.has(Perms)) {

                    client.channels.cache.get(annchannel.id).send({ content: annnouceText });
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription('Announcement Has Been Sent to the Specified Channel')

                    return interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });      
                } else {

                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You do not have the required permission \`${Perms}\`.`)

                    return interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                }

            } else {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Unknown Error.`)

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            }

        } else {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`This Command is Limited!`)

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }
    },
};

