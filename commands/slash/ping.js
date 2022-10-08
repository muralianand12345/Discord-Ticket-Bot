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

        try {

            await interaction.deferReply({ content: "Connecting Discord API" });
            await wait(1000);
            await interaction.editReply({ content: "Loading ." });
            await wait(500);
            await interaction.editReply({ content: "Loading .." });
            await wait(500);
            await interaction.editReply({ content: "Loading ..." });
            await wait(500);
            await interaction.editReply({ content: "Loading ." });
            await wait(500);
            await interaction.editReply({ content: "Loading .." });
            await wait(500);
            await interaction.editReply({ content: "Loading ..." });
            await wait(500);
            await interaction.editReply({ content: "Loading ." });
            await wait(500);
            await interaction.editReply({ content: "Loading .." });
            await wait(500);
            await interaction.editReply({ content: "Loading ..." });
            await wait(500);
            await interaction.editReply({ content: "Fast As Fuck Boiiiiii 🏃💨 ..." });
            await wait(2000);
            await interaction.editReply({ content: "**🏓 Pong!**" });

            let embed = new EmbedBuilder()
                .addFields({ name: "Ping:", value: Math.round(client.ws.ping) + "ms" })
                .setColor("Random")
                .setTimestamp()
            await interaction.editReply({ embeds: [embed] });

        } catch (err) {
            const commandName = "ping.js";
            const Line = "Catch Error";
            var chanID;
            if (interaction.channel == null) {
                chanID = "DM";
            } else {
                chanID = interaction.channel.id;
            }
            return client.err_log.error(client, commandName, interaction.user.id, chanID, Line, err);
        }
    }
};