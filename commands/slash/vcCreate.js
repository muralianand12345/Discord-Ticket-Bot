const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require('discord.js');

const dateSetupData = require("../../events/models/vcCreateGuild.js");

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('vccreate')
        .setDescription("Create VC when user joins")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addChannelOption(option =>
            option.setName('vc-id')
                .setDescription('Create new VC when user joins')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('vc-category')
                .setDescription('Category/Parent where VC to be created!')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('vc-log')
                .setDescription('Logs VC create')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('vc-name')
                .setDescription('VC name to start with')
        ),

    async execute(interaction, client) {

        //log
        const commandName = "VCCREATE_SETUP";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        const guildObj = client.guilds.cache.get(interaction.guild.id);

        const vcChan = await interaction.options.getChannel("vc-id");
        if (!guildObj.channels.cache.has(vcChan.id)) {
            const embedReply = new EmbedBuilder()
                .setColor('#ED4245')
                .setDescription(`The Channel does not belong to this server!`)
            return interaction.reply({
                embeds: [embedReply],
                ephemeral: true
            });
        }
        if (vcChan.type !== ChannelType.GuildVoice) {
            const embedReply = new EmbedBuilder()
                .setColor('#ED4245')
                .setDescription(`Select only voice channels!`)
            return interaction.reply({
                embeds: [embedReply],
                ephemeral: true
            });
        }

        const vcParent = await interaction.options.getChannel("vc-category");
        if (!guildObj.channels.cache.has(vcParent.id)) {
            const embedReply = new EmbedBuilder()
                .setColor('#ED4245')
                .setDescription(`The Category does not belong to this server!`)
            return interaction.reply({
                embeds: [embedReply],
                ephemeral: true
            });
        }
        if (vcParent.type !== ChannelType.GuildCategory) {
            const embedReply = new EmbedBuilder()
                .setColor('#ED4245')
                .setDescription(`Select only Category channels!`)
            return interaction.reply({
                embeds: [embedReply],
                ephemeral: true
            });
        }

        const data = await dateSetupData.findOne({
            guildID: interaction.guild.id
        }).catch(console.error);

        if (data) {
            await dateSetupData.findOneAndRemove({
                guildID: interaction.guild.id
            });
        }

        const vcLog = await interaction.options.getChannel("vc-log") || null;
        const vcName = await interaction.options.getString("vc-name");

        if (!vcName) {
            var newData = dateSetupData({
                guildID: interaction.guild.id,
                vcID: vcChan.id,
                parentID: vcParent.id,
                name: null,
                logID: vcLog.id
            });
            await newData.save();
        } else {
            var newData = dateSetupData({
                guildID: interaction.guild.id,
                vcID: vcChan.id,
                parentID: vcParent.id,
                name: vcName,
                logID: vcLog.id
            });
            await newData.save();
        }

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setDescription(`VC Setup Successfull!`)
            .setTimestamp()
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}