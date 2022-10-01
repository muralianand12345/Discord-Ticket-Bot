const PastebinAPI = require('pastebin-ts');
require("dotenv").config();

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
        if (interaction.customId == "open-ticket-fivem") {

            const InteID = BigInt(interaction.user.id) + BigInt(1);

            if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == InteID.toString())) {
                interaction.reply({
                    content: '**You have already created a ticket! Kindly Contact any \`Ticket Supporters\` if not!**',
                    ephemeral: true
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"Already Opened a Ticket!",err);
                });

                const ticEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({ name: "FiveM"})
                .setDescription("Unable to open a new Ticket")
                .addFields(
                    { name: 'User', value: `<@!${interaction.user.id}>`},
                    { name: 'Reason', value: "has already opened a Ticket"}
                )
                return errorSend.send({ embeds:[ticEmbed] });   
            };
 
            await interaction.guild.channels.create({
                name: `fivem-ticket-${interaction.user.username}`,
                parent: client.config.FIVEM_TICKET.MAIN,
                topic: InteID.toString(),
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: client.config.FIVEM_TICKET.ROLE_SUPPORT.ID,
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
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    client.err_log.error(client,commandName,interaction.user.id,c.id,"Ticket Not Created",err);
                });

                const embed = new EmbedBuilder()
                    .setColor('Dark_Blue')
                    .setAuthor({ name:'Ticket', iconURL: client.config.EMBED.IMAGE })
                    .setDescription('Select the category of your ticket')
                    .setFooter({text: client.config.EMBED.FOOTTEXT, iconURL: client.config.EMBED.IMAGE })
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
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"Ticket Options Error",err);
                });
                
                const collector = await msg.createMessageComponentCollector({
                    componentType: ComponentType.SelectMenu,
                    time: 30000
                });
                
                collector.on('collect', i => {
                    if (i.user.id === interaction.user.id) {
                        if (msg.deletable) {
                            msg.delete().then(async() => {
                                const embed = new EmbedBuilder()
                                .setColor('Dark_Blue')
                                .setAuthor({name:'Ticket', iconURL: client.config.EMBED.IMAGE })
                                .setDescription(`<@!${interaction.user.id}> Created a ticket ${i.values[0]}`)
                                .setFooter({text: client.config.EMBED.FOOTTEXT, iconURL: client.config.EMBED.IMAGE })
                                .setTimestamp();

                                const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId('close-ticket-fivem')
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
                            }).catch(err => {
                                const commandName = "interactionCreateFiveM.js";
                                client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"Option After Ticket",err);
                            });
                        };
                    
                        if (i.values[0] == 'Ooc') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.OOC
                            });
                        };
                        if (i.values[0] == 'CombatLogging') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.CL
                            });
                        };
                        if (i.values[0] == 'Bugs') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.BUG
                            });
                        };
                        if (i.values[0] == 'Supporters') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.SUPPORT
                            });
                        };
                        if (i.values[0] == 'Planned') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.PLANNED
                            });
                        };
                        if (i.values[0] == 'Character') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.CHAR
                            });
                        };
                        if (i.values[0] == 'BanAppeal') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.BAN
                            });
                        };
                        if (i.values[0] == 'Others') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.OTHER
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
                        }).catch( err => {
                            const commandName = "interactionCreateFiveM.js";
                            client.err_log.error(client,commandName,"User Unknown","Deleted Channel","No Category Selected Error. (Unable to close)",err);
                        });

                        const ticEmbed2 = new EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({ name: "FIVEM"})
                        .setDescription("Menu Closed")
                        .addFields(
                            { name: 'User', value: `<@!${interaction.user.id}>`},
                            { name: 'Reason', value: "No Category Selected"}
                        )
                        errorSend.send({ embeds:[ticEmbed2] });
                    };
                });
            });
        };

        try{
            if (interaction.customId == "close-ticket-fivem") {
                const userButton = interaction.user.id;
                const guild = client.guilds.cache.get(interaction.guildId);
                const chan = guild.channels.cache.get(interaction.channelId);

                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('confirm-close-fivem')
                    .setLabel('Close ticket')
                    .setStyle(ButtonStyle.Danger),
                    
                    new ButtonBuilder()
                    .setCustomId('no-fivem')
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
                    if (i.customId == 'confirm-close-fivem') {
                        interaction.editReply({
                            content: `Ticket closed by <@!${i.user.id}>`,
                            components: []
                        });

                        const chanID = i.channel.id;
                        const ChanTopic = BigInt(chan.topic) - BigInt(1);

                        chan.edit({
                            name: `closed-${chan.name}`,
                            parent: client.config.FIVEM_TICKET.CLOSED,
                            permissionOverwrites: [
                                {
                                    id: client.users.cache.get(ChanTopic.toString()), //error
                                    deny: [PermissionFlagsBits.SendMessages,PermissionFlagsBits.ViewChannel],
                                },
                                {
                                    id: client.config.FIVEM_TICKET.ROLE_SUPPORT.ID,
                                    allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        })
                        .catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            client.err_log.error(client,commandName,interaction.user.id,chanID,"Ticket Close Error",err);
                        })
                        .then(async() => {
                            const embed = new EmbedBuilder()
                            .setColor('Dark_Blue')
                            .setAuthor({name:'Ticket', iconURL: client.config.EMBED.IMAGE })
                            .setDescription('```Ticket Supporters, Delete After Verifying```')
                            .setFooter({text: client.config.EMBED.FOOTTEXT, iconURL: client.config.EMBED.IMAGE }) 
                            .setTimestamp();

                            const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('delete-ticket-fivem')
                                .setLabel('Delete ticket')
                                .setEmoji('🗑️')
                                .setStyle(ButtonStyle.Danger),
                            );

                            chan.send({
                                embeds: [embed],
                                components: [row]
                            })
                            .catch( err => {
                                const commandName = "interactionCreateFiveM.js";
                                client.err_log.error(client,commandName,interaction.user.id,chanID,"Ticket Close Error",err);
                            });
                        });
                        collector.stop();
                    };
                     
                    if (i.customId == 'no-fivem') {
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

        } catch(err) {
            const commandName = "interactionCreateFiveM.js";
            client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"Ticket Delete Error",err);
        }

        try{
            if (interaction.customId == "delete-ticket-fivem") {
                const guild = client.guilds.cache.get(interaction.guildId);
                const chan = guild.channels.cache.get(interaction.channelId);

                interaction.reply({
                    content: 'Saving Messages and Deleting the channel ...'
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"Saving Message Interaction",err);
                });

                const chanTopic = BigInt(chan.topic) - BigInt(1);

                chan.messages.fetch().then(async(messages) => {
                    let a = messages.filter(m => m.author.bot !== true).map(m =>
                        `${new Date(m.createdTimestamp).toLocaleString('hi-IN')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                    ).reverse().join('\n');

                    if (a.length < 1) a = "This Ticket is Empty"

                    let pastebinKey = process.env.PASTE_BIN;;
                    let pastebin = null;
                    pastebin = new PastebinAPI(pastebinKey);
                    
                    await pastebin.createPaste({
                        text: a,
                        title: `${chanTopic.toString()}`,
                        format: null,
                        privacy: 1
                    })
                    .catch(err => {
                        const commandName = "interactionCreateFiveM.js";
                        client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"Ticket Log Error (Unable to Save)",err);
                    })
                    .then(function(urlToPaste) {
                        const embed = new EmbedBuilder()
                        .setAuthor({name:'Logs Ticket', iconURL: client.config.EMBED.IMAGE })
                        .setDescription(`📰 Logs of the ticket \`${chan.id}\` created by <@!${chanTopic.toString()}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${urlToPaste})`)
                        .setColor('Dark_Blue')
                        .setTimestamp();

                        client.channels.cache.get(client.config.FIVEM_TICKET.LOG.CHAN_ID).send({
                            embeds: [embed]
                        }).catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            client.err_log.error(client,commandName,"Unknown User","Channel Deleted","Unable to send ticket log",err);
                        });

                        client.users.cache.get(chanTopic.toString()).send({
                            embeds: [embed]
                        }).catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            client.err_log.error(client,commandName,chanTopic.toString(),"Unable to DM the user",err);
                        });

                        setTimeout( () => chan.delete().catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            client.err_log.error(client,commandName,"Unknown User","Channel Deleted","Spamming",err);
                        }),5000);

                    })
                    .catch(err => {
                        const commandName = "interactionCreateFiveM.js";
                        client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"HasteBin Error",err);
                    });
                });
            };

        } catch(err){
            const commandName = "interactionCreateFiveM.js";
            client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,"lINE 431 InteractionCreateFiveM",err);
        }
    },
};