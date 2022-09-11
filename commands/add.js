const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    PermissionFlagsBits 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add someone to the ticket (Ticket Command) ')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to add to ticket')
            .setRequired(true)),
    async execute(interaction, client) {

        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
            
        //log
        const commandName = "ADD";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]});

        try{
            const chan = client.channels.cache.get(interaction.channelId);
            const user = interaction.options.getUser('target');
            const userID = user.id;

            let Support_Role;

            function Fivem() {
                return Support_Role = client.config.FIVEM_TICKET.ROLE_SUPPORT.ID;
            }

            function Redm() {
                return Support_Role = client.config.REDM_TICKET.ROLE_SUPPORT.ID;
            }

            if ( interaction.guild.id == client.config.ANNOUNCE.GUILD_1.ID ) {
                Fivem();
            } else if ( interaction.guild.id == client.config.ANNOUNCE.GUILD_2.ID ) {
                Redm();

            } else {
                const logEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("ERROR Has Occured\nFile Name: add.js")
                return err_logchan.send({ embeds: [logEmbed]});
            }

            if (chan.name.includes('ticket')) {
                chan.edit({
                    permissionOverwrites: [
                        {
                            id: userID,
                            allow: [PermissionFlagsBits.SendMessages,PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: Support_Role,
                            allow: [PermissionFlagsBits.SendMessages,PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(async() => {
                    interaction.reply({
                        content: `<@${user.id}> has been added to the ticket!`
                    });
                });
            } else {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('You are not in a Ticket!')

                await interaction.reply({
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