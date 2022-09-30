const { 
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Custom voting (Only Admins)')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Your vote poll message here')
                .setRequired(true)),
    async execute(interaction, client) {
        const text = interaction.options.getString('text');

        //log
        const commandName = "VOTING";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        function sendMsg() {
            const votechan = client.channels.cache.get(client.config.VOTE.CHAN_ID);
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`\`\`\`${text}\`\`\``)

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('vote1')
                        .setEmoji("👍")
                        .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                        .setCustomId('vote2')
                        .setEmoji("👎")
                        .setStyle(ButtonStyle.Danger),
                );
            votechan.send({ embeds: [embed], components: [button] }).then(async (message) => {
                await message.pin();
                await interaction.channel.bulkDelete(1);
            }).catch(err => console.log(err));
        }

        try {
            sendMsg();
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("`Vote Sent Successfully!`")

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });

        } catch (err) {
            const commandName = "voting.js";
            const Line = "Catch Error";
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }
    },
};