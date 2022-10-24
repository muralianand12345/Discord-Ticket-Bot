const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('questions')
        .setDescription('Sends EliteX PR Question')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {

        //log
        const commandName = "QUESTIONS";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        const chan = client.channels.cache.get(interaction.channelId);
        if (chan.name.includes('ticket')) {
            //sent message
            sendMsg();
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("`A Question has been Sent Successfully!`")

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });

        } else {
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("You must be in a ticket to use this command")

            return await interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        function sendMsg() {
            const ticketChan = interaction.channel.id;
            const reactionRole = client.channels.cache.get(ticketChan);
            const embed = new EmbedBuilder()
                .setColor("Orange")
                .setDescription('```EliteX Exclusive Role```')

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('elitexpr')
                        .setLabel("Start")
                        .setStyle(ButtonStyle.Success),
                );
            reactionRole.send({ embeds: [embed], components: [button] });
        }
    },
};