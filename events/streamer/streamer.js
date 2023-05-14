const {
    EmbedBuilder,
    Events
} = require('discord.js');

//This is not actually you do it! We must use PresenceUpdate event and it is more efficient than this
//If you know how to do, you are most welcomed!

module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        if (client.config.ENABLE.STREAMER == true) {

            //Config Files
            const YTRoleId = client.streamer.ROLE.YOUTUBER;
            const GuildId = client.streamer.GUILD;
            const Interval = client.streamer.UPDATE_INTERVAL;
            const EliteXRP = client.streamer.ROLE.ELITEXPR;

            //Loggin Channel
            const ERROR_CHAN = client.streamer.CHAN_ID;
            const err_log = client.channels.cache.get(ERROR_CHAN);

            //auto check after 20 secs
            var GuildInfo, YTRole, Role_Total, PRRole, YT_Total, PR_Total, Role_Total;

            GuildInfo = await client.guilds.cache.get(GuildId);
            await GuildInfo.members.fetch()

            setInterval(async () => {
                YTRole = await GuildInfo.roles.cache.find(role => role.id == YTRoleId);
                PRRole = await GuildInfo.roles.cache.find(role => role.id == EliteXRP);

                YT_Total = await YTRole.members.map(m => m);
                PR_Total = await PRRole.members.map(m => m);

                return Role_Total = PR_Total.filter((element) => {
                    return YT_Total.includes(element);
                });
            }, Interval);

            //Gives Streamer role when STREAMING
            try {
                async function YTUsers(Role) {

                    await Role.forEach(async (User) => {
                        if (User.presence !== null) {

                            var Bool = false;
                            await User.presence.activities.forEach(async (activity) => {
                                if (activity.type == 1) {
                                    return Bool = true;
                                }
                            });

                            //Add role or remove
                            if (Bool == true) {
                                const StreamRoleId = client.streamer.ROLE.STREAM;
                                if (User.roles.cache?.has(StreamRoleId)) {
                                    return;
                                } else {
                                    let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
                                    await User.roles.add(streamRole).catch(err => {
                                        console.log(`Streamer Add role Error || ${err}`);
                                    });
                                    var embed_log = new EmbedBuilder()
                                        .setDescription("**STREAMER ROLE ADDED**")
                                        .setFields(
                                            { name: "User Tag", value: `<@${User.id}>` },
                                            { name: "User Name", value: `\`${User.user.tag}\`` },
                                            { name: "User ID", value: `\`${User.id}\`` }
                                        )
                                    err_log.send({ embeds: [embed_log] });
                                }

                            } else if (Bool == false) {
                                const StreamRoleId = client.streamer.ROLE.STREAM;
                                let streamRole = await GuildInfo.roles.cache.get(StreamRoleId);
                                await User.roles.remove(streamRole).catch(err => {
                                    console.log(`Streamer Remove role Error ${err}`);
                                });

                            } else {
                                err_log.send({ content: `**ERROR**\nReason: Bool is neither true nor false` });;
                            }
                        }
                    });
                }

                //Call function in a loop (every 20 seconds)
                setInterval(async () => {
                    await YTUsers(Role_Total)
                }, Interval);

            } catch (err) {
                //Error catch
                console.log(err);
            }
        }
    }
}