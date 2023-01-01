const {
    EmbedBuilder,
    Events,
    AuditLogEvent
} = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Red')
            .addFields(
                { name: member.guild.name, value: member.guild.id },
                { name: `${member.user.username}#${member.user.discriminator}`, value: `<@${member.user.id}>` }
            )
            .setTimestamp()

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
        });

        const kickLog = fetchedLogs.entries.first();

        if (!kickLog) {
            logEmbed.setTitle('Member Left from the Server')
            return client.channels.cache.get(client.glog.MEMBER.LEAVE).send({
                embeds: [logEmbed]
            });
        }

        const { executor, target } = kickLog;

        if (target.id === member.id) {
            logEmbed.setTitle('Member has been Kicked!')
                .addFields(
                    { name: "Kicked By", value: executor.tag }
                )
            return client.channels.cache.get(client.glog.MEMBER.KICK).send({
                embeds: [logEmbed]
            });

        } else {
            logEmbed.setTitle('Member has been Kicked!')
                .addFields(
                    { name: "Kicked By", value: 'Unable to get audit log' }
                )
            return client.channels.cache.get(client.glog.MEMBER.KICK).send({
                embeds: [logEmbed]
            });
        }
    }
}