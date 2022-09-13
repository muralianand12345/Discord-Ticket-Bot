let hastebin = require('hastebin');
//Database - MongoDB

const db = require('../mongodb/schema.js'); //Ticket Details
const db2 = require('../mongodb/schema2.js'); //Global Server Ticket Number
const db3 = require('../mongodb/schema3.js'); //Closed Ticket Details

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
const { findOneAndDelete, findOne } = require('../mongodb/schema.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        
        const errChan = client.config.ERR_LOG.CHAN_ID;
        const errorSend = client.channels.cache.get(errChan);

        if (!interaction.isButton()) return;
        const user_idd=interaction.user.id;
        if (interaction.customId == "open-ticket-fivem") {

        //Global Server Ticket Number Updation - Database
            const global_ticket_no=db2.findOne({guild_id:interaction.guild.id},async (err,records)=>
            {
                if(!records) {
                    const new_db2=new db2({
                        guild_id:interaction.guild.id,
                        global_ticket_no:1,
                    });
                    await new_db2.save();
                }
                else if (records){
                    records.global_ticket_no+=1;
                    await records.save();
                }
            });
    
        //Repeated Ticket Violation Checker
            var ticket_no=db.findOne({user_id:interaction.user.id},async(err,records)=>
            {
                if (records)
                {
                    await interaction.reply({
                        content: '**You have already created a ticket! Kindly Contact any \`Ticket Supporters\` if not!**',
                        ephemeral: true
                    }).catch(err => {
                        const commandName = "interactionCreateFiveM.js(line 49)";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Already Opened a Ticket!"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
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
                }
            });
        //Channel Creation    
            await interaction.guild.channels.create({
                name: `fivem-ticket-${interaction.user.username}`,
                parent: client.config.FIVEM_TICKET.MAIN,
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
                var ticket_channel=c;
                await interaction.reply({
                    content: `Ticket created! <#${c.id}>`,
                    ephemeral: true
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    const errTag = client.config.ERR_LOG.ERR_TAG;
                    const errEmbed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setColor("Red")
                    .setDescription(`${err}`)
                    .addFields(
                        { name: "File", value: `${commandName}`},
                        { name: "User", value: `<@!${interaction.user.id}>`},
                        { name: "Channel", value: `<#${c.id}>`},
                        { name: "Line", value: "Ticket Not Created"}
                    )
                    client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                });

                const embed = new EmbedBuilder()
                    .setColor('Dark_Blue')
                    .setAuthor({name:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                    .setDescription('Select the category of your ticket')
                    .setFooter({text:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
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
                    const errTag = client.config.ERR_LOG.ERR_TAG;
                    const errEmbed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setColor("Red")
                    .setDescription(`${err}`)
                    .addFields(
                        { name: "File", value: `${commandName}`},
                        { name: "User", value: `<@!${interaction.user.id}>`},
                        { name: "Channel", value: `<#${interaction.channel.id}>`},
                        { name: "Line", value: "Ticket Options Error"}
                    )
                    client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                });
                
                const collector = await msg.createMessageComponentCollector({
                    componentType: ComponentType.SelectMenu,
                    time: 30000
                });
                
                collector.on('collect', async (i) => {
                    if (i.user.id === interaction.user.id) { 
                        if (msg.deletable) {
                            //Ticket Details Updation - Database
                            
                            await msg.delete().then(async() => {
                                var ticket_no=db.findOne({user_id:interaction.user.id},async(err,record)=>
                            {
                                if (!record)
                                {   var global_ticket_no=db2.findOne({guild_id:interaction.guild.id},async(err,records)=>
                                {
                                    const new_ticket_no=new db({
                                        guild_id:interaction.guild.id,
                                        user_id: interaction.user.id,
                                        username:interaction.user.username,
                                        usertag:interaction.user.discriminator,
                                        ticket_channel_id: ticket_channel.id,
                                        user_ticket_no:records.global_ticket_no,
                                        ticket_status: "open",
                                    });
                                    await new_ticket_no.save();
                                                                
                                const embed = new EmbedBuilder()
                                .setColor('Dark_Blue')
                                .setAuthor({name:`Ticket - ${new_ticket_no.user_ticket_no}`, iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                                .setDescription(`<@!${interaction.user.id}> Created a ticket ${i.values[0]}`)
                                .setFooter({text:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
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
                            })
                        }
                        });    
                            }).catch(err => {
                                const commandName = "interactionCreateFiveM.js";
                                const errTag = client.config.ERR_LOG.ERR_TAG;
                                const errEmbed = new EmbedBuilder()
                                .setTitle("ERROR")
                                .setColor("Red")
                                .setDescription(`${err}`)
                                .addFields(
                                    { name: "File", value: `${commandName}`},
                                    { name: "User", value: `<@!${interaction.user.id}>`},
                                    { name: "Channel", value: `<#${interaction.channel.id}>`},
                                    { name: "Line", value: "Option After Ticket"}
                                )
                                client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
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
                            const errTag = client.config.ERR_LOG.ERR_TAG;
                            const errEmbed = new EmbedBuilder()
                            .setTitle("ERROR")
                            .setColor("Red")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "Line", value: "No Category Selected Error. (Unable to close)"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
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
                        

                        const chanID = i.channel.id;
                        var ticket_details=db.findOne({user_id:user_idd},async(err,records)=>
                        {
                            var close_ticket_details = new db3({
                                guild_id:records.guild_id,
                                user_id:records.user_id,
                                username:records.username,
                                usertag:records.usertag,
                                ticket_channel_id:records.ticket_channel_id,
                                user_ticket_no:records.user_ticket_no,
                                ticket_status:"closed",
                            })
                            await close_ticket_details.save();
                            await interaction.editReply({
                                content: `Ticket - ${records.user_ticket_no} closed by <@!${i.user.id}>`,
                                components: []
                            });
                            await db.findOneAndDelete({user_id:user_idd});
                            
                        });

                        chan.edit({
                            name: `closed-${chan.name}`,
                            parent: client.config.FIVEM_TICKET.CLOSED,
                            permissionOverwrites: [
                                {
                                    id: client.users.cache.get(user_idd), //error
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
                            const errTag = client.config.ERR_LOG.ERR_TAG;
                            const errEmbed = new EmbedBuilder()
                            .setTitle("ERROR")
                            .setColor("Red")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "User", value: `<@!${interaction.user.id}>`},
                                { name: "Channel", value: `<#${chanID}>`},
                                { name: "Line", value: "Ticket Close Error"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                        })
                        .then(async() => {
                            const embed = new EmbedBuilder()
                            .setColor('Dark_Blue')
                            .setAuthor({name:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                            .setDescription('```Ticket Supporters, Delete After Verifying```')
                            .setFooter({text:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'}) 
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
                                const errTag = client.config.ERR_LOG.ERR_TAG;
                                const errEmbed = new EmbedBuilder()
                                .setTitle("ERROR")
                                .setColor("Red")
                                .setDescription(`${err}`)
                                .addFields(
                                    { name: "File", value: `${commandName}`},
                                    { name: "User", value: `<@!${interaction.user.id}>`},
                                    { name: "Channel", value: `<#${chanID}>`},
                                    { name: "Line", value: "Ticket Close Error"}
                                )
                                client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
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
            const errTag = client.config.ERR_LOG.ERR_TAG;
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "File", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`},
                { name: "Line", value: "Ticket Delete Error"}
            )
            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
        }

        try{
            if (interaction.customId == "delete-ticket-fivem") {
                const guild = client.guilds.cache.get(interaction.guildId);
                const chan = guild.channels.cache.get(interaction.channelId);

                interaction.reply({
                    content: 'Saving Messages and Deleting the channel ...'
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    const errTag = client.config.ERR_LOG.ERR_TAG;
                    const errEmbed = new EmbedBuilder()
                    .setTitle("ERROR")
                    .setColor("Red")
                    .setDescription(`${err}`)
                    .addFields(
                        { name: "File", value: `${commandName}`},
                        { name: "User", value: `<@!${interaction.user.id}>`},
                        { name: "Channel", value: `<#${interaction.channel.id}>`},
                        { name: "Line", value: "Saving Message Interaction"}
                    )
                    client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                });

                chan.messages.fetch().then(async(messages) => {
                    let a = messages.filter(m => m.author.bot !== true).map(m =>
                        `${new Date(m.createdTimestamp).toLocaleString('hi-IN')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                    ).reverse().join('\n');

                    if (a.length < 1) a = "This Ticket is Empty"

                    hastebin.createPaste(a, {
                        contentType: 'text/plain',
                        server: 'https://hastebin.com'
                    }, {})
                    .catch(err => {
                        const commandName = "interactionCreateFiveM.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Ticket Log Error (Unable to Save)"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    })
                    .then(function(urlToPaste) {
                        const embed = new EmbedBuilder()
                        .setAuthor({name:'Logs Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                        .setDescription(`📰 Logs of the ticket \`${chan.id}\` created by <@!${user_idd}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${urlToPaste})`)
                        .setColor('Dark_Blue')
                        .setTimestamp();
                        const delete_details=db3.findOne({user_id:user_idd},async(err,records)=>{
                            records.ticket_status="Deleted";
                            records.hastebin=`${urlToPaste}`;
                            await records.save();
                        })
                        client.channels.cache.get(client.config.FIVEM_TICKET.LOG.CHAN_ID).send({
                            embeds: [embed]
                        }).catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            const errTag = client.config.ERR_LOG.ERR_TAG;
                            const errEmbed = new EmbedBuilder()
                            .setTitle("ERROR")
                            .setColor("Red")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "Line", value: "Unable to send ticket log"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                        });

                        setTimeout( () => chan.delete().catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            const errTag = client.config.ERR_LOG.ERR_TAG;
                            const errEmbed = new EmbedBuilder()
                            .setTitle("ERROR")
                            .setColor("Red")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "Line", value: "Spamming"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                        }),5000);

                    })
                    .catch(err => {
                        const commandName = "interactionCreateFiveM.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new EmbedBuilder()
                        .setTitle("ERROR")
                        .setColor("Red")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "HasteBin Error"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
                });
            };

        } catch(err){
            const commandName = "interactionCreateFiveM.js";
            const errTag = client.config.ERR_LOG.ERR_TAG;
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "File", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
    },
};