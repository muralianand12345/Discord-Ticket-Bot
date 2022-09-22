const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const cooldown = new Set();
const cooldownTime = 30000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async execute(interaction, client) {

        //log
        const commandName = "PING";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        try{ 
            if (cooldown.has(interaction.user.id)) {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Try Again Later (Cooldown)')

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            
            } else {
                await interaction.reply({content: "Pinging EliteX Support Bot ..."});
                await wait(1000);
                await interaction.editReply({content:"Fast As Fuck Boiiiiii 🏃💨 ..."});
                await wait(2000);
                await interaction.editReply({content:"**🏓 Pong!**"});

                let embed = new EmbedBuilder()
                .addFields({ name: "Ping:", value: Math.round(client.ws.ping) + "ms" })
                .setColor("Random")
                .setTimestamp()
                await interaction.editReply({ embeds: [embed] });

                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);

            }
      
        } catch(err) {
            const commandName = "ping.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }
    }
};