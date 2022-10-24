const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    cooldown: 2000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('premiumpack')
        .setDescription("Sends Premium Pack Message(Admin)")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(
            option =>
                option.setName('name')
                    .setDescription('Pack Name Here!')
                    .setRequired(true)
        )
        .addStringOption(
            option =>
                option.setName('month')
                    .setDescription('Month Name Here!')
                    .setRequired(true)
        )
        .addStringOption(
            option =>
                option.setName('link')
                    .setDescription('Website Link Here!')
                    .setRequired(true)
        )
        .addChannelOption(
            option =>
                option.setName('channelid')
                    .setDescription('Channel you want to send!')
                    .setRequired(false)
        ),

    async execute(interaction, client) {

        const packMonth = interaction.options.getString('month');
        const packName = interaction.options.getString('name');
        const packLink = interaction.options.getString('link');

        let supchannel;
        if (interaction.options.getChannel('channelid') == null) {
            supchannel = client.config.SUP_PACK.CHAN_ID;
        } else {
            supchannel = interaction.options.getChannel('channelid').id
        }

        //log
        const commandName = "PREPACK";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        //embed function
        async function sendSupMsg() {
            const supChan = client.channels.cache.get(supchannel);
            const supEmbed = new EmbedBuilder()
                .setColor("White")
                .setTitle("Supporter Packs")
                .setDescription(`\`\`\`${packName}\`\`\``)

            const supButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`${packMonth} Pack`)
                        .setEmoji('🪙')
                        .setStyle(ButtonStyle.Link)
                        .setURL(packLink)
                )

            supChan.send({
                embeds: [supEmbed],
                components: [supButton],
            });
        }

        const ReplyEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("Supporter Pack Message Has Been Sent!")
        interaction.reply({
            embeds: [ReplyEmbed],
            ephemeral: true
        }).then(() => {
            sendSupMsg();
        });


    }
};