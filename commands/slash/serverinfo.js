const {
    EmbedBuilder,
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription("Send's The Server's Info"),
    async execute(interaction, client) {

        //log
        const commandName = "SERVERINFO";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        try {

            const guild = interaction.guild;
            const owner = await guild.fetchOwner();
            const channels = await guild.channels.fetch();
            const roles = await guild.roles.fetch();

            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
                })
                .setThumbnail(guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg')
                .addFields(
                    { name: 'Server Creation', value: `<t:${Math.round(guild.createdTimestamp / 1000)}:f>` },
                    { name: 'Owner', value: `${owner}`, inline: true },
                    { name: 'Server', value: `${guild.name}`, inline: true },
                    { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                    { name: 'Server Id', value: `${guild.id}`, inline: true },
                    { name: 'Total Channels', value: `${channels.size}`, inline: true },
                    { name: 'Role Count', value: `${roles.size}`, inline: true },
                )
                .setFooter({
                    text: `Guild ID: ${guild.id}`
                })

            await interaction.reply({
                embeds: [embed]
            });

        } catch (err) {
            const commandName = "serverinfo.js";
            const Line = "Catch Error";
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }

    }
};