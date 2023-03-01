const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');

const channelData = require("../../events/models/channel.js")
const parentData = require("../../events/models/ticketParent.js")

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription("Setup or stop the tickets system in your server!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup the tickets system for your server!')
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('Set the channel for the ticket!')
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('logchannel')
                    .setDescription('Set the Log channel for the ticket!')
                    .setRequired(true)
                )
                .addRoleOption(option => option
                    .setName('supportrole')
                    .setDescription('Ticket Supporters Role!')
                    .setRequired(true)
                ),

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop the tickets system for your server!'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('category-setup')
                .setDescription('Set the categorys for the ticket!')
                .addChannelOption(option => option
                    .setName('main')
                    .setDescription('Main Category')
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('ooc')
                    .setDescription('OOC Category')
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('supporters')
                    .setDescription('Supporters Pack Category')
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('bug')
                    .setDescription('Bugs Category')
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('character')
                    .setDescription('Character Issue Category')
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('other')
                    .setDescription('Other Issues Category')
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('closed')
                    .setDescription('Closed Ticket Category')
                    .setRequired(true)
                ),
        ),

    async execute(interaction, client) {

        //log
        const commandName = "TICKET";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        if (interaction.options.getSubcommand() === "setup") {
            const channel = await interaction.options.getChannel("channel");
            const logChannel = await interaction.options.getChannel("logchannel");
            const suppRole = await interaction.options.getRole("supportrole");

            //finding the data
            const data = await channelData.findOne({
                ticketGuildID: interaction.guild.id,
            }).catch(console.error);

            if (data) {
                const embedReply = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('Ticket System Already Registered!')
                return interaction.reply({
                    embeds: [embedReply],
                    ephemeral: true
                });
            } else if (!data) {
                let newData = new channelData({
                    ticketGuildID: interaction.guild.id,
                    ticketChannelID: channel.id,
                    ticketSupportID: suppRole.id,
                    ticketLogChannelID: logChannel.id
                });
                await newData.save();

                const embed = new EmbedBuilder()
                    .setColor('#6d6ee8')
                    .setTitle("Open a Support Ticket")
                    .setDescription('Click on the button to Raise Ticket')
                    .setFooter({ text: client.config.EMBED.FOOTTEXT, iconURL: client.user.avatarURL() })
                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('open-ticket')
                            .setLabel('TICKET')
                            .setEmoji('🎫')
                            .setStyle(ButtonStyle.Success),
                    );

                channel.send({
                    embeds: [embed],
                    components: [button]
                });

                const embedReply = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription('Ticket System Setup Successfully!')
                return interaction.reply({
                    embeds: [embedReply],
                    ephemeral: true
                });
            }
        } else if (interaction.options.getSubcommand() === "stop") {
            const data = await channelData.findOne({
                ticketGuildID: interaction.guild.id
            }).catch(console.error);

            if (data) {
                await channelData.findOneAndRemove({
                    ticketGuildID: interaction.guild.id
                });

                const embedReply = new EmbedBuilder()
                    .setColor('Orange')
                    .setDescription('Ticket System has been disabled from this server!')
                return interaction.reply({
                    embeds: [embedReply],
                    ephemeral: true
                });
            } else if (!data) {
                const embedReply = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Ticket system isn't enabled for your server!`)
                return interaction.reply({
                    embeds: [embedReply],
                    ephemeral: true
                });
            }
        } else if (interaction.options.getSubcommand() === "category-setup") {
            const mainPar = await interaction.options.getChannel("main");
            const oocPar = await interaction.options.getChannel("ooc");
            const supPar = await interaction.options.getChannel("supporters");
            const bugPar = await interaction.options.getChannel("bug");
            const charPar = await interaction.options.getChannel("character");
            const otherPar = await interaction.options.getChannel("other");
            const closedPar = await interaction.options.getChannel("closed");

            var bool = false;
            function checkParent(chan) {
                if (chan.type !== ChannelType.GuildCategory) {
                    return bool = true;
                } else {
                    return;
                }
            }
            checkParent(mainPar);
            checkParent(oocPar);
            checkParent(supPar);
            checkParent(bugPar);
            checkParent(charPar);
            checkParent(otherPar);
            checkParent(closedPar);

            if (bool == false) {
                const data = await parentData.findOne({
                    guildID: interaction.guild.id,
                }).catch(console.error);

                if (data) {
                    const embedReply = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`Ticket System Already Registered!`)
                    return interaction.reply({
                        embeds: [embedReply],
                        ephemeral: true
                    });
                } else if (!data) {
                    let newData = new parentData({
                        guildID: interaction.guild.id,
                        mainPar: mainPar.id,
                        oocPar: oocPar.id,
                        suppPar: supPar.id,
                        bugPar: bugPar.id,
                        charPar: charPar.id,
                        otherPar: otherPar.id,
                        closedPar: closedPar.id
                    });
                    await newData.save();

                    const embedReply = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`Ticket Category Setup Successfully!`)
                    return interaction.reply({
                        embeds: [embedReply],
                        ephemeral: true
                    });
                }
            } else if (bool == true) {
                const embedReply = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Kindly Select only Category!`)
                return interaction.reply({
                    embeds: [embedReply],
                    ephemeral: true
                });
            }
        }
    }
};
