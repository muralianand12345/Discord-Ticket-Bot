const {
    EmbedBuilder,
    Events
} = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('New Guild Joined')
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
