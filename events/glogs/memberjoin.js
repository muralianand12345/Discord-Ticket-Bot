const {
    EmbedBuilder,
    Events
} = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Member Joined the Server')
            .addFields(
                { name: member.guild.name, value: member.guild.id },
                { name: `${member.user.username}#${member.user.discriminator}`, value: `<@${member.user.id}>` }
            )
            .setTimestamp()

        client.channels.cache.get(client.glog.MEMBER.LEAVE).send({
            embeds: [logEmbed]
        });
    }
}