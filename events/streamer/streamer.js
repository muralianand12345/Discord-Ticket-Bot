//Updated version with reduced API load and bug fix

const {
    Events,
    ActivityType
} = require('discord.js');

module.exports = {
    name: Events.PresenceUpdate,
    async execute(oldMember, newMember, client) {

        if (client.config.ENABLE.STREAM == true) {

            const streamingRoleID = client.streaming.ROLEID;
            const member = newMember.member;
            if (member.user.bot) return;

            if (member.roles.cache.has(client.streaming.YTROLEID)) {
                if (newMember.guild.id == client.streaming.GUILDID) {

                    const nowStreamingRole = newMember.guild.roles.cache.find(role => role.id === streamingRoleID);
                    const isStreamingOnYouTube = newMember.activities.some(activity =>
                        activity.type === ActivityType.Streaming && activity.name.toLowerCase().includes('youtube')
                    );

                    if (isStreamingOnYouTube) {
                        if (member.roles.cache.has(streamingRoleID)) return;
                        member.roles.add(nowStreamingRole)
                            .then(() => console.log(`Assigned "Now Streaming" role to ${member.user.tag}`))
                            .catch(console.error);
                            
                    } else {
                        if (!member.roles.cache.has(streamingRoleID)) return;
                        member.roles.remove(nowStreamingRole)
                            .then(() => console.log(`Removed "Now Streaming" role from ${member.user.tag}`))
                            .catch(console.error);
                    }
                }
            }
        }
    }
}