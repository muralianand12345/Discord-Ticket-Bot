const {
    EmbedBuilder,
    Events
} = require('discord.js');

module.exports = {
    name: Events.GuildUpdate,
    async execute(oldGuild, newGuild, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Black')
            .setTitle('Guild Change')
            .setDescription(`Before: ${oldGuild.name}\nAfter: ${newGuild.name}`)
            .setTimestamp()

        client.channels.cache.get(client.glog.GUILD.ERROR).send({
            embeds: [logEmbed]
        });
    }
}
