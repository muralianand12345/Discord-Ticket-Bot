const {
    EmbedBuilder,
    Events,
    AuditLogEvent
} = require('discord.js');

module.exports = {
    name: Events.InviteCreate,
    async execute(invite, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Invite Link Created')
            .addFields(
                { name: invite.guild.name, value: invite.guild.id },
                { name: 'Invite Code', value: invite.code },
                { name: 'Channel', value: `<#${invite.channelId}>` }
            )
            .setTimestamp()

        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.InviteCreate,
        });
        const inviteLog = fetchedLogs.entries.first();

        if (!inviteLog) {
            return client.channels.cache.get(client.glog.GUILD.INVITE).send({
                embeds: [logEmbed]
            });
        }

        const { executor, target } = inviteLog; //memberCount

        if (target.guild.id === invite.guild.id) {
            logEmbed.addFields(
                { name: 'Invite Created by', value: executor.tag }
            )
        } else {
            logEmbed.addFields(
                { name: 'Audit Log Status', value: 'Failed' }
            )
        }

        return client.channels.cache.get(client.glog.GUILD.INVITE).send({
            embeds: [logEmbed]
        });
    }
}