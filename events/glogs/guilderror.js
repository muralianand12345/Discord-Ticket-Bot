const {
    EmbedBuilder,
    Events
} = require('discord.js');

//GUILD ERROR
module.exports = {
    name: Events.GuildUnavailable,
    async execute(guild, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Guild Unavailable')
            .setDescription(guild.name)
            .setTimestamp()

        client.channels.cache.get(client.glog.GUILD.ERROR).send({
            embeds: [logEmbed]
        });
    }
}