const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const cooldown = new Set();
const cooldownTime = 30000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async execute(interaction, client) {
        const commandName = "PING";

        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

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
            const errTag = client.config.ERR_LOG.ERR_TAG;
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
    }
};