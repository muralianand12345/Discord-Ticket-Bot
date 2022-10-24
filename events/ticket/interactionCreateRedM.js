const discordTranscripts = require('discord-html-transcripts');
require("dotenv").config();
const fs = require('fs');
const buttonCooldown = new Set()

//Collector & Channel
const {
    ChannelType,
    PermissionFlagsBits,
    ComponentType
} = require('discord.js');
//Embeds & Buttons & Select Menus
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SelectMenuBuilder
} = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        const errChan = client.config.ERR_LOG.CHAN_ID;
        const errorSend = client.channels.cache.get(errChan);

        if (!interaction.isButton()) return;
        if (interaction.customId == "open-ticket-redm") {

            const InteID = BigInt(interaction.user.id) + BigInt(2);

            if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == InteID.toString())) {
                interaction.reply({
                    content: '**You have already created a ticket! Kindly Contact any \`Ticket Supporters\` if not!**',
                    ephemeral: true
                });

                const ticEmbed = new EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: "RedM" })
                    .setDescription("Unable to open a new Ticket")
                    .addFields(
                        { name: 'User', value: `<@!${interaction.user.id}>` },
                        { name: 'Reason', value: "has already opened a Ticket" }
                    )
                return errorSend.send({ embeds: [ticEmbed] });
            };

            await interaction.guild.channels.create({
                name: `redm-ticket-${interaction.user.username}`,
                parent: client.config.REDM_TICKET.MAIN,
                topic: InteID.toString(),
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: client.config.REDM_TICKET.ROLE_SUPPORT.ID,
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
                    .setFooter({ text: client.config.EMBED.FOOTTEXT, iconURL: client.config.EMBED.IMAGE })
                    .setTimestamp();

                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('category')
                            .setPlaceholder('Select the ticket category')
                            .addOptions([
                                {
                                    label: 'OOC',
                                    value: 'Ooc',
                                    emoji: '📝',
                                },
                                {
                                    label: 'COMBAT LOGGING',
                                    value: 'CombatLogging',
                                    emoji: '🗡️',
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
                                    label: 'PLANNED RP',
                                    value: 'Planned',
                                    emoji: '📓',
                                },
                                {
                                    label: 'CHARACTER ISSUE',
                                    value: 'Character',
                                    emoji: '🪲',
                                },
                                {
                                    label: 'BAN APPEAL',
                                    value: 'BanAppeal',
                                    emoji: '🚫',
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
                                            .setCustomId('close-ticket-redm')
                                            .setLabel('Close Ticket')
                                            .setEmoji('899745362137477181')
                                            .setStyle(ButtonStyle.Danger),
                                    );

                                const opened = await c.send({
                                    content: `**Your Ticket Has Been Created!** *Use \`/id\` and fill the following!*`,
                                    embeds: [embed],
                                    components: [row]
                                });

                                opened.pin().then(() => {
                                    opened.channel.bulkDelete(1);
                                });
                            });
                        };

                        if (i.values[0] == 'Ooc') {
                            c.edit({
                                parent: client.config.REDM_TICKET.OOC
                            });
                        };
                        if (i.values[0] == 'CombatLogging') {
                            c.edit({
                                parent: client.config.REDM_TICKET.CL
                            });
                        };
                        if (i.values[0] == 'Bugs') {
                            c.edit({
                                parent: client.config.REDM_TICKET.BUG
                            });
                        };
                        if (i.values[0] == 'Supporters') {
                            c.edit({
                                parent: client.config.REDM_TICKET.SUPPORT
                            });
                        };
                        if (i.values[0] == 'Planned') {
                            c.edit({
                                parent: client.config.REDM_TICKET.PLANNED
                            });
                        };
                        if (i.values[0] == 'Character') {
                            c.edit({
                                parent: client.config.REDM_TICKET.CHAR
                            });
                        };
                        if (i.values[0] == 'BanAppeal') {
                            c.edit({
                                parent: client.config.REDM_TICKET.BAN
                            });
                        };
                        if (i.values[0] == 'Others') {
                            c.edit({
                                parent: client.config.REDM_TICKET.OTHER
                            });
                        };
                    };
                });

                collector.on('end', collected => {
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
                            .setAuthor({ name: "REDM" })
                            .setDescription("Menu Closed")
                            .addFields(
                                { name: 'User', value: `<@!${interaction.user.id}>` },
                                { name: 'Reason', value: "No Category Selected" }
                            )
                        errorSend.send({ embeds: [ticEmbed2] });
                    };
                });
            });
        };


        if (interaction.customId == "close-ticket-redm") {
            const userButton = interaction.user.id;
            const guild = client.guilds.cache.get(interaction.guildId);
            const chan = guild.channels.cache.get(interaction.channelId);

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm-close-redm')
                        .setLabel('Close ticket')
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId('no-redm')
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

            collector.on('collect', i => {
                if (i.customId == 'confirm-close-redm') {
                    interaction.editReply({
                        content: `Ticket closed by <@!${i.user.id}>`,
                        components: []
                    });

                    const chanID = i.channel.id;
                    const ChanTopic = BigInt(chan.topic) - BigInt(2);

                    chan.edit({
                        name: `closed-${chan.name}`,
                        parent: client.config.REDM_TICKET.CLOSED,
                        permissionOverwrites: [
                            {
                                id: client.users.cache.get(ChanTopic.toString()), //error
                                deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: client.config.REDM_TICKET.ROLE_SUPPORT.ID,
                                allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.guild.roles.everyone,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                        ],
                    })

                        .then(async () => {
                            const embed = new EmbedBuilder()
                                .setColor('Dark_Blue')
                                .setAuthor({ name: 'Ticket', iconURL: client.config.EMBED.IMAGE })
                                .setDescription('```Ticket Supporters, Delete After Verifying```')
                                .setFooter({ text: client.config.EMBED.FOOTTEXT, iconURL: client.config.EMBED.IMAGE })
                                .setTimestamp();

                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('delete-ticket-redm')
                                        .setLabel('Delete ticket')
                                        .setEmoji('🗑️')
                                        .setStyle(ButtonStyle.Danger),
                                );

                            chan.send({
                                embeds: [embed],
                                components: [row]
                            });
                        });
                    collector.stop();
                };

                if (i.customId == 'no-redm') {
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
        };

        if (interaction.customId == "delete-ticket-redm") {

            if (buttonCooldown.has(interaction.user.id)) {
                const replyEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Interaction not registered! (Button Spam Dedected!)")
                interaction.reply({ embeds: [replyEmbed], ephemeral: true });
            } else {
                buttonCooldown.add(interaction.user.id);

                const guild = client.guilds.cache.get(interaction.guildId);
                const chan = guild.channels.cache.get(interaction.channelId);
                if (chan == null) return;

                interaction.reply({
                    content: 'Saving Messages and Deleting the channel in 10 seconds...'
                });

                const chanTopic = BigInt(chan.topic) - BigInt(2);

                //Ticket Logs
                const htmlCode = await discordTranscripts.createTranscript(chan, {
                    limit: -1,
                    returnType: 'string',
                    filename: `transcript-${chan.id}.html`,
                    saveImages: true,
                    poweredBy: false
                });

                const serverAdd = `${process.env.SERVER_IP}:${process.env.PORT}`;

                fs.writeFile(`./ticket-logs/transcript-${chan.id}.html`, htmlCode, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

                const embed = new EmbedBuilder()
                    .setAuthor({ name: 'Logs Ticket', iconURL: client.config.EMBED.IMAGE })
                    .setDescription(`📰 Logs of the ticket \`${chan.id}\` created by <@!${chanTopic.toString()}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](http://${serverAdd}/transcript-${chan.id}.html)`)
                    .setColor('Dark_Blue')
                    .setTimestamp();

                client.channels.cache.get(client.config.REDM_TICKET.LOG.CHAN_ID).send({
                    embeds: [embed]
                });

                client.users.cache.get(chanTopic.toString()).send({
                    embeds: [embed]
                });

                setTimeout(() => chan.delete().catch(error => {
                    if (error.code == 10003) {
                        return; //channel not found error
                    }
                }), 10000);

                setTimeout(() => buttonCooldown.delete(interaction.user.id), 20000)
            }
        };

    },
};
