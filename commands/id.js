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
        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
           
        //log
        const commandName = "ID";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]}); 

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
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            err_logchan.send({ content: `${errTag}`, embeds: [errEmbed] });
        }
    },
};
