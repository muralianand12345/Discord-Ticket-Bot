const { 
    SlashCommandBuilder, 
    EmbedBuilder 
} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async execute(interaction, client) {

        //log
        const commandName = "PING";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        try {

            await interaction.reply({ content: "Pinging EliteX Support Bot ..." });
            await wait(1000);
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
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }
    }
};