const {
    ChannelType,
    PermissionFlagsBits,
    ComponentType,
    Events,
} = require('discord.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require("discord.js");

const ticketModel = require('../../events/models/ticket.js');
const ticketData = require("../../events/models/channel.js");
const guildModel = require('../../events/models/guild.js');
const ticketPar = require('../../events/models/ticketParent.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        const errChan = client.config.ERR_LOG.CHAN_ID;
        const errorSend = client.channels.cache.get(errChan);

        if (!interaction.isButton()) return;

        if (interaction.customId == "open-ticket") {

            var ticketCheck = await ticketModel.findOne({
                userID: interaction.user.id
            }).catch(err => console.log(err));

            if (ticketCheck) {
                interaction.reply({
                    content: '**You have already created a ticket! Kindly Contact any Ticket Supporters if not!**',
                    ephemeral: true
                });

                const ticEmbed = new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription("Unable to open a new Ticket")
                    .addFields(
                        { name: 'User', value: `<@!${interaction.user.id}>` },
                        { name: 'Reason', value: "has already opened a Ticket" }
                    )
                return errorSend.send({ embeds: [ticEmbed] });
            }

            var IdData = await ticketData.findOne({
                ticketGuildID: interaction.guild.id
            }).catch(err => console.log(err));

            var guildDoc = await guildModel.findOne({
                guildID: interaction.guild.id
            }).catch(err => console.log(err));

            if (!guildDoc) {
                guildDoc = new guildModel({
                    guildID: interaction.guild.id,
                    ticketCount: 0
                });
                await guildDoc.save();
            }

            guildDoc.ticketCount += 1;
            await guildDoc.save();

            var ticketParents = await ticketPar.findOne({
                guildID: interaction.guild.id
            }).catch(err => console.log(err));

            if (!ticketParents) {
                return interaction.reply({ content: 'Setup is incomplete :(', ephemeral: true });

            } else if (ticketParents) {
                var mainTicket = ticketParents.mainPar;
            }

            var ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${guildDoc.ticketCount}`,
                parent: mainTicket,
                topic: interaction.user.username,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
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
                type: ChannelType.GuildText,
            }).then(async c => {
                interaction.reply({
                    content: `Ticket created! <#${c.id}>`,
                    ephemeral: true
                });

                const embed = new EmbedBuilder()
                    .setColor('Dark_Blue')
                    .setAuthor({ name: 'Ticket', iconURL: client.config.EMBED.IMAGE })
                    .setDescription('Select the category of your ticket')
                    .setFooter({ text: client.config.EMBED.FOOTTEXT, iconURL: client.user.avatarURL() })
                    .setTimestamp();

                const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('category')
                            .setPlaceholder('Select the ticket category')
                            .addOptions([
                                {
                                    label: 'OOC',
                                    value: 'Ooc',
                                    emoji: '📝',
                                },
                                {
                                    label: 'BUGS',
                                    value: 'Bugs',
                                    emoji: '🐛',
                                },
                                {
                                    label: 'SUPPORTERS PACK',
                                    value: 'Supporters',
                                    emoji: '💎',
                                },
                                {
                                    label: 'CHARACTER ISSUE',
                                    value: 'Character',
                                    emoji: '🪲',
                                },
                                {
                                    label: 'OTHERS',
                                    value: 'Others',
                                    emoji: '📙',
                                },
                            ]),
                    );

                msg = await c.send({
                    content: `<@!${interaction.user.id}>`,
                    embeds: [embed],
                    components: [row]
                });

                var ticketDoc = await new ticketModel({
                    guildID: interaction.guild.id,
                    userID: interaction.user.id,
                    ticketID: c.id,
                    ticketStatus: false,
                    msgID: msg.id
                });
                await ticketDoc.save();

                const collector = await msg.createMessageComponentCollector({
                    componentType: ComponentType.SelectMenu,
                    time: 30000
                });

                collector.on('collect', i => {
                    if (i.user.id === interaction.user.id) {
                        if (msg.deletable) {
                            msg.delete().then(async () => {
                                const embed = new EmbedBuilder()
                                    .setColor('Dark_Blue')
                                    .setAuthor({ name: 'Ticket', iconURL: client.config.EMBED.IMAGE })
                                    .setDescription(`<@!${interaction.user.id}> Created a ticket ${i.values[0]}`)
                                    .setFooter({ text: client.config.EMBED.FOOTTEXT, iconURL: client.config.EMBED.IMAGE })
                                    .setTimestamp();

                                const row = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('close-ticket')
                                            .setLabel('Close Ticket')
                                            .setEmoji('899745362137477181')
                                            .setStyle(ButtonStyle.Danger),
                                    );

                                const opened = await c.send({
                                    content: `**Your Ticket Has Been Created!**`,
                                    embeds: [embed],
                                    components: [row]
                                });

                                opened.pin().then(() => {
                                    opened.channel.bulkDelete(1);
                                });

                                ticketDoc.msgPannelID = opened.id;
                                ticketDoc.ticketStatus = true;
                                await ticketDoc.save();
                            });
                        };

                        if (i.values[0] == 'Ooc') {
                            c.edit({
                                parent: ticketParents.oocPar
                            });
                        };
                        if (i.values[0] == 'Bugs') {
                            c.edit({
                                parent: ticketParents.bugPar
                            });
                        };
                        if (i.values[0] == 'Supporters') {
                            c.edit({
                                parent: ticketParents.suppPar
                            });
                        };
                        if (i.values[0] == 'Character') {
                            c.edit({
                                parent: ticketParents.charPar
                            });
                        };
                        if (i.values[0] == 'Others') {
                            c.edit({
                                parent: ticketParents.otherPar
                            });
                        };
                    };
                });


                collector.on('end', async (collected) => {
                    if (collected.size < 1) {
                        c.send(`No category selected. Closing the ticket ...`).then(() => {
                            setTimeout(() => {
                                if (c.deletable) {
                                    c.delete();
                                }
                            }, 5000);
                        });

                        const ticEmbed2 = new EmbedBuilder()
                            .setColor("Blue")
                            .setAuthor({ name: "FIVEM" })
                            .setDescription("Menu Closed")
                            .addFields(
                                { name: 'User', value: `<@!${interaction.user.id}>` },
                                { name: 'Reason', value: "No Category Selected" }
                            )
                        errorSend.send({ embeds: [ticEmbed2] });
                        await ticketDoc.deleteOne();
                    };
                });
            });
        }
    }
};
