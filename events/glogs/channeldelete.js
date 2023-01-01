const {
    EmbedBuilder,
    Events
} = require('discord.js');


module.exports = {
    name: Events.ChannelDelete,
    async execute(channel, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Channel has been deleted')
            .setDescription(`**${channel.name}** has been deleted`)
            .addFields(
                { name: `Guild`, value: `${channel.guild.name}`, inline: true },
                { name: `Name`, value: `${channel.name}`, inline: true },
                { name: `ID`, value: `${channel.id}`, inline: true },
                { name: `NSFW`, value: `${channel.nsfw ? 'Yes :white_check_mark:' : 'No :x:'}`, inline: true }
            )
            .setTimestamp()

        client.channels.cache.get(client.glog.GUILD.CHAN).send({
            embeds: [logEmbed]
        });
    }
}