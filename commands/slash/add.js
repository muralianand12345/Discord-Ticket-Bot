const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    PermissionFlagsBits 
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add someone to the ticket (Ticket Command) ')
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to add to ticket')
            .setRequired(true)),
    async execute(interaction, client) {         
      
        //log
        const commandName = "ADD";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

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
                const err = "ERROR Has Occured\nFile Name: add.js";
                const commandName = "add.js";
                const Line = "Else Error";
                return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
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
                        content: `<@${user.id}> must me in a ticket to access the form!`,
                        ephemeral: true
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
            const commandName = "add.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }     
    },
};