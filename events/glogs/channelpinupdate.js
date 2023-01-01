const {
    EmbedBuilder,
    Events
} = require('discord.js');


module.exports = {
    name: Events.ChannelPinsUpdate,
    async execute(channel, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Black')
            .setAuthor({ name: `Channel PINS Update`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Message has been pinned or unpinned`)
            .addFields(
                { name: `Guild`, value: `${channel.guild.name}`, inline: true },
                { name: `Channel`, value: `${channel.name}`, inline: true },
                { name: `Mention`, value: `<#${channel.id}>`, inline: true },
                { name: `Channel ID`, value: `${channel.id}`, inline: true },
            )
            .setTimestamp()

        client.channels.cache.get(client.glog.GUILD.CHAN).send({
            embeds: [logEmbed]
        });
    }
}