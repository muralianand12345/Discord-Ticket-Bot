const {
    EmbedBuilder,
    Events
} = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    async execute(guild, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Guild Left/Kicked')
            .addFields(
                { name: 'Guild Name', value: guild.name },
                { name: "Guild ID", value: guild.id }
            )
            .setTimestamp()

        client.channels.cache.get(client.glog.GUILD.NEW).send({
            embeds: [logEmbed]
        });
    }
}