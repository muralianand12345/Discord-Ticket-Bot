const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ready',
    async execute(client) {

        const Interval = client.discordpresence.INTERVALS;

        //Embeds
        async function ActEmbed(User, presence, color) {
            var logChan = client.channels.cache.get(client.discordpresence.LOG.CHANID);

            const UserPresenceEmbed = new EmbedBuilder()
                .setColor(color)
                .setDescription(`User: <@${User.id}>`)
                .setFields(
                    { name: "Game Name", value: `${presence.name}` }
                )
            return logChan.send({ embeds: [UserPresenceEmbed] });
        }

        //Discord Presence
        async function CheckPresence() {
            var EliteXExclusive_ID = client.discordpresence.ROLE.ID1;
            var GuildId = client.discordpresence.GUILD.ID;
            
            var GuildInfo, EliteXExclusive;
            var Total_Users = null;

            GuildInfo = await client.guilds.cache.get(GuildId);
            EliteXExclusive = await GuildInfo.roles.cache.find(role => role.id == EliteXExclusive_ID);
            Total_Users = await EliteXExclusive.members.map(m => m.user);

            for (var i = 0; i < Total_Users.length; i++) {
                const Mention = await client.guilds.cache.get(GuildId).members.cache.get(Total_Users[i].id);
                if (Mention.presence == null) {
                    //return;
                } else {
                    Mention.presence.activities.forEach(async (activity) => {
                        if (activity.type == 0) {
                            if (activity.name === "ELITE X") {
                                await ActEmbed(Mention, activity, "Green");

                            } else if (activity.name === "Server 1") {
                                await ActEmbed(Mention, activity, "Red");

                            } else if (activity.name === "Server 2") {
                                await ActEmbed(Mention, activity, "Red");

                            } else if (activity.name === "Server 3") {
                                await ActEmbed(Mention, activity, "Red");

                            } else if (activity.name === "Server 4") {
                                await ActEmbed(Mention, activity, "Red");

                            } else if (activity.name === "Server 5") {
                                await ActEmbed(Mention, activity, "Red");

                            } else if (activity.name === "FiveM") {
                                await ActEmbed(Mention, activity, "Yellow");

                            } else if (activity.name === "Server 6") {
                                await ActEmbed(Mention, activity, "Orange");

                            } else if (activity.name === "Server 7") {
                                await ActEmbed(Mention, activity, "Orange");

                            } else if (activity.name === "Server 8") {
                                await ActEmbed(Mention, activity, "Orange");

                            } else {
                                await ActEmbed(Mention, activity, "Blue");
                            }
                        }
                    });
                }
            }
        }

        if (client.config.ENABLE.DISCORDPRESENCE == true) {
            setInterval(async () => {
                await CheckPresence();
            }, Interval);
        }
    },
};
