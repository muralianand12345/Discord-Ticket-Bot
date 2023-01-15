const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js');

const discordTranscripts = require('discord-html-transcripts');
require("dotenv").config();
const fs = require('fs');
const ticketData = require("../../events/models/channel.js");
const ticketModel = require('../../events/models/ticket.js');

module.exports = {
    cooldown: 2000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('ticketbackup')
        .setDescription('Gets a manual ticket backup')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption(option =>
            option.setName('dm')
                .setDescription('Send copy to the user?')
                .setRequired(false)),

    async execute(interaction, client) {

        var IdData = await ticketData.findOne({
            ticketGuildID: interaction.guild.id
        }).catch(err => console.log(err));

        //log
        const commandName = "TICKETBACKUP";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        const dmOption = interaction.options.getBoolean('dm') || false;
        const chan = interaction.channel;
        if (chan.name.includes('ticket')) {

            const ticketDoc = await ticketModel.findOne({
                ticketID: interaction.channel.id
            }).catch(err => console.log(err));

            const htmlCode = await discordTranscripts.createTranscript(chan, {
                limit: -1,
                returnType: 'string',
                filename: `transcript-${chan.id}.html`,
                saveImages: false,
                poweredBy: false
            });

            const serverAdd = `${process.env.SERVER_IP}:${process.env.PORT}`;

            fs.writeFile(`./ticket-logs/transcript-${chan.id}.html`, htmlCode, function (err) {
                if (err) {
                    console.log(err);
                }
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Manual Log Ticket', iconURL: client.config.EMBED.IMAGE })
                .setDescription(`📰 Logs of the ticket \`${chan.id}\` created by <@!${ticketDoc.userID}> and logged by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](http://${serverAdd}/transcript-${chan.id}.html)`)
                .setColor('Red')
                .setTimestamp();

            client.channels.cache.get(IdData.ticketLogChannelID).send({
                embeds: [embed]
            });

            const commUser = interaction.user.id;

            client.users.cache.get(commUser).send({
                embeds: [embed]
            }).catch(error => {
                if (error.code == 50007) {
                    const logembed = new EmbedBuilder()
                        .setColor('Black')
                        .setDescription(`Unable to DM User: <@${commUser}>\n\`Ticket No: ${chan.id}\``)

                    return errorSend.send({
                        embeds: [logembed]
                    });
                }
            });

            if (dmOption == true) {
                client.users.cache.get(ticketDoc.userID).send({
                    embeds: [embed]
                }).catch(error => {
                    if (error.code == 50007) {
                        const logembed = new EmbedBuilder()
                            .setColor('Black')
                            .setDescription(`Unable to DM User: <@${ticketDoc.userID}>\n\`Ticket No: ${chan.id}\``)

                        return errorSend.send({
                            embeds: [logembed]
                        });
                    }
                });
            }

            const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription('Ticket has been logged successfully')

            await interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });

        } else {
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('You are not in a Ticket!')

            await interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }
    },
};