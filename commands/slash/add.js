const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

const ticketData = require("../../events/models/channel.js");

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

        const ticketDoc = await ticketModel.findOne({
            ticketGuildID: interaction.guild.id
        }).catch(err => console.log(err));

        //log
        const commandName = "ADD";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);


        const chan = client.channels.cache.get(interaction.channelId);
        const user = interaction.options.getUser('target');
        const userID = user.id;

        let Support_Role = ticketDoc.ticketSupportID;

        if (chan.name.includes('ticket')) {
            chan.edit({
                permissionOverwrites: [
                    {
                        id: userID,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: Support_Role,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                    },
                ],
            }).then(async () => {
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
    },
};