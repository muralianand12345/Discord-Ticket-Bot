const { 
    SlashCommandBuilder,
    EmbedBuilder
 } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription('Citzen ID and Name (Ticket Command)')
        .addStringOption(
            option =>
            option.setName('citiname')
            .setDescription('Citizen Name')
            .setRequired(true)
        )
        .addStringOption(
            option =>
            option.setName('citiid')
            .setDescription('Citizen ID')
            .setRequired(true)
        ),

    async execute(interaction, client) {   
           
        //log
        const commandName = "ID";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        try {
            const chan = client.channels.cache.get(interaction.channelId);
            if (chan.name.includes('ticket')) {
                const citizenName = interaction.options.getString('citiname');
                const citizenID = interaction.options.getString('citiid');
                
                const embed = new EmbedBuilder()
                .setColor("Green")
                .addFields(
                    { name: 'Citizen Name', value: citizenName, inline: true },
                    { name: 'Citizen ID', value: citizenID, inline: true },
                )
                interaction.reply({ embeds: [embed] });
            } else {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("**You Must Be In A Ticket To Use This Command!**")

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            }

        } catch(err) {
            const commandName = "id.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }
    },
};
