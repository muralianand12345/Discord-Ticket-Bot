const {
    EmbedBuilder,
    Events,
    AuditLogEvent
} = require('discord.js');

module.exports = {
    name: Events.GuildBanRemove,
    async execute(ban, client) {
        const logEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('User UnBanned')
            .addFields(
                { name: ban.guild.name, value: ban.guild.id },
                { name: ban.user.tag, value: ban.user.id }
            )
            .setTimestamp()

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove,
        });

        const banLog = fetchedLogs.entries.first();

        if (!banLog) {
            return client.channels.cache.get(client.glog.MEMBER.BAN).send({
                embeds: [logEmbed]
            });
        }

        const { executor, target } = banLog;

        if (target.id === ban.user.id) {
            logEmbed.addFields(
                { name: 'UnBanned By', value: executor.tag },
                { name: 'Action Type', value: banLog.actionType },
            )
        } else {
            logEmbed.addFields(
                { name: 'UnBanned By', value: 'Audit Log Failed' }
            )
        }
        return client.channels.cache.get(client.glog.MEMBER.BAN).send({
            embeds: [logEmbed]
        });
    }
}