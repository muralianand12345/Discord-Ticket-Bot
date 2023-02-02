const {
    Events,
} = require('discord.js');
const {
    EmbedBuilder
} = require('discord.js');

const discordTranscripts = require('discord-html-transcripts');
require("dotenv").config();
const fs = require('fs');
const ticketData = require("../../events/models/channel.js");
const ticketModel = require('../../events/models/ticket.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        if (interaction.customId == "transcript-ticket") {
            const chan = interaction.channel;

            var IdData = await ticketData.findOne({
                ticketGuildID: interaction.guild.id
            }).catch(err => console.log(err));

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
                .setAuthor({ name: 'Ticket Transcript', iconURL: client.config.EMBED.IMAGE })
                .setDescription(`📰 Logs of the ticket \`${chan.id}\` created by <@!${ticketDoc.userID}> and logged by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](http://${serverAdd}/transcript-${chan.id}.html)`)
                .setColor('Orange')
                .setTimestamp();

            await client.channels.cache.get(IdData.ticketLogChannelID).send({
                embeds: [embed]
            });

            await client.users.cache.get(interaction.user.id).send({
                embeds: [embed]
            }).catch(error => {
                if (error.code == 50007) {
                    const logembed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`Unable to DM`);

                    return interaction.reply({
                        embeds: [logembed],
                        ephemeral: true
                    });
                } else {
                    console.error(error);
                }
            }).then(() => {

                const donembed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription('Ticket has been logged successfully');

                interaction.reply({
                    embeds: [donembed],
                    ephemeral: true
                });
            });
        }
    }
};