const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    cooldown: 10000,

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!")
        .setDMPermission(true),
    async execute(interaction, client) {

        //log
        const commandName = "PING";
        var chanID;
        if (interaction.channel == null) {
            chanID = "DM";
        } else {
            chanID = interaction.channel.id;
        }
        client.std_log.error(client, commandName, interaction.user.id, chanID);

        await interaction.reply({ content: "**🏓 Pong!**" });

        let embed = new EmbedBuilder()
            .addFields({ name: "Ping:", value: Math.round(client.ws.ping) + "ms" })
            .setColor("Random")
            .setTimestamp()
        await interaction.editReply({ embeds: [embed] });
    }
};