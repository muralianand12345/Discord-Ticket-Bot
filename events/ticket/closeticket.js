const {
    PermissionFlagsBits,
    ComponentType,
    Events,
} = require('discord.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const ticketModel = require('../../events/models/ticket.js');
const ticketData = require("../../events/models/channel.js");
const ticketPar = require('../../events/models/ticketParent.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        if (interaction.customId == "close-ticket") {

            const IdData = await ticketData.findOne({
                ticketGuildID: interaction.guild.id
            }).catch(err => console.log(err));

            if (!IdData) {
                return;
            }

            const ticketDoc = await ticketModel.findOne({
                ticketID: interaction.channel.id
            }).catch(err => console.log(err));

            var ticketParents = await ticketPar.findOne({
                guildID: interaction.guild.id
            }).catch(err => console.log(err));

            if (!ticketParents) {
                return;
            } else if (ticketParents) {
                var closeTicket = ticketParents.otherPar;
            }

            const userButton = interaction.user.id;
            const guild = client.guilds.cache.get(interaction.guildId);
            const chan = guild.channels.cache.get(interaction.channelId);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm-close')
                        .setLabel('Close ticket')
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId('no')
                        .setLabel('Cancel closure')
                        .setStyle(ButtonStyle.Secondary),
                );

            const verif = await interaction.reply({
                content: 'Are you sure you want to close the ticket?',
                components: [row]
            });

            const collector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 10000
            });

            collector.on('collect', async (i) => {
                if (i.customId == 'confirm-close') {
                    interaction.editReply({
                        content: `Ticket closed by <@!${i.user.id}>`,
                        components: []
                    });

                    await verif.delete();

                    chan.edit({
                        name: `ticket-closed`,
                        parent: closeTicket,
                        permissionOverwrites: [
                            {
                                id: ticketDoc.userID,
                                deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: IdData.ticketSupportID,
                                allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.guild.roles.everyone,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                        ],
                    }).then(async () => {
                        const embed = new EmbedBuilder()
                            .setColor('Dark_Blue')
                            .setAuthor({ name: 'Ticket', iconURL: client.config.EMBED.IMAGE })
                            .setDescription('```Ticket Supporters, Delete After Verifying```')
                            .setFooter({ text: client.config.EMBED.FOOTTEXT, iconURL: client.config.EMBED.IMAGE })
                            .setTimestamp();

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('delete-ticket')
                                    .setLabel('Delete ticket')
                                    .setEmoji('🗑️')
                                    .setStyle(ButtonStyle.Danger),
                            );

                        chan.send({
                            embeds: [embed],
                            components: [row]
                        });

                        ticketDoc.msgPannelID = null;
                        ticketDoc.ticketStatus = false;
                        await ticketDoc.save();
                    });

                    collector.stop();
                };

                if (i.customId == 'no') {
                    interaction.editReply({
                        content: `**Ticket closure cancelled!** (<@${i.user.id}>)`,
                        components: []
                    });
                    collector.stop();
                };
            });

            collector.on('end', (i) => {
                if (i.size < 1) {
                    interaction.editReply({
                        content: `**Closing of the canceled ticket!** (<@!${userButton}>)`,
                        components: []
                    });
                };
            });
        }
    }
}