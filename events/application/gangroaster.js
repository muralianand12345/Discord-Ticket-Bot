const {
    PermissionFlagsBits,
    Events
} = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        //Sunday = 0, Monday = 1

        async function GangRoaster() {
            const now = new Date();
            const currDay = now.getDay().toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata"
            });

            const gangID = client.gang.ROSTER.GANGLEADERID;
            const prID = client.gang.ROSTER.PRID;
            const channelName = client.gang.ROSTER.CHANNAME;
            const GuildID = client.gang.ROSTER.GUILDID;
            const ChanID = client.gang.ROSTER.CHANID;

            if (currDay == 3) {
                const Guild = client.guilds.cache.get(GuildID)
                const chan = client.channels.cache.get(ChanID);
                await chan.edit({
                    name: `${channelName}`,
                    topic: `Will be open only on wednesdays (automatically by bots)`,
                    permissionOverwrites: [
                        {
                            id: Guild.roles.cache.find(role => role.id == gangID),
                            allow: [
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: Guild.roles.cache.find(role => role.id == prID),
                            allow: [
                                PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: Guild.roles.everyone,
                            deny: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ManageChannels,
                                PermissionFlagsBits.CreateInstantInvite,
                                PermissionFlagsBits.CreatePrivateThreads,
                                PermissionFlagsBits.CreatePublicThreads,
                                PermissionFlagsBits.AddReactions,
                                PermissionFlagsBits.MentionEveryone,
                                PermissionFlagsBits.ManageMessages,
                                PermissionFlagsBits.UseApplicationCommands
                            ]
                        }
                    ]
                });

            } else {

                const Guild = client.guilds.cache.get(GuildID)
                const chan = client.channels.cache.get(ChanID);
                await chan.edit({
                    name: `${channelName}-ᴄʟᴏꜱᴇᴅ`,
                    topic: `Will be open only on wednesdays (automatically by bots)`,
                    permissionOverwrites: [
                        {
                            id: Guild.roles.cache.find(role => role.id == gangID),
                            allow: [
                                PermissionFlagsBits.ViewChannel
                            ],
                            deny: [
                                PermissionFlagsBits.SendMessages
                            ]
                        },
                        {
                            id: Guild.roles.cache.find(role => role.id == prID),
                            allow: [
                                PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: Guild.roles.everyone,
                            deny: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ManageChannels,
                                PermissionFlagsBits.CreateInstantInvite,
                                PermissionFlagsBits.CreatePrivateThreads,
                                PermissionFlagsBits.CreatePublicThreads,
                                PermissionFlagsBits.AddReactions,
                                PermissionFlagsBits.MentionEveryone,
                                PermissionFlagsBits.ManageMessages,
                                PermissionFlagsBits.UseApplicationCommands
                            ]
                        }
                    ]
                });
            }
        }

        if (client.config.ENABLE.GANGROSTER == true) {
            setInterval(async () => {
                await GangRoaster()
            }, client.gang.ROSTER.INTERVAL);
        }
    },
};