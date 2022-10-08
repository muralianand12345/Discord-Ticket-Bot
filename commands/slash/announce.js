const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('VP Announcement')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addChannelOption(
            option =>
                option.setName('channelid')
                    .setDescription('Channel you want to send!')
                    .setRequired(true)
        )
        .addStringOption(
            option =>
                option.setName('text')
                    .setDescription('Announcements')
                    .setRequired(true)
        ),

    async execute(interaction, client) {

        const annnouceText = interaction.options.getString('text');
        const annchannel = interaction.options.getChannel('channelid');

        const commandName = "ADD";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        if (annchannel.type !== ChannelType.GuildText) {
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Select only TEXT Channel!')

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }
        await interaction.deferReply();
        await wait(4000);

        const finalEmbed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`Announcement Send to <#${annchannel.id}>`)

            annchannel.send({ content: annnouceText }).then(async () => {
            return await interaction.editReply({ embeds: [finalEmbed], ephemeral: true });
        });
    }
};