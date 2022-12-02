const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ready',
    async execute(client) {

        const Interval = client.discordpresence.INTERVALS;

        async function CheckPresence() {
            var EliteXExclusive_ID = client.discordpresence.ROLE.ID1;
            var GuildId = client.discordpresence.GUILD.ID;
            var logChan = client.channels.cache.get(client.discordpresence.LOG.CHANID);

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
                    Mention.presence.activities.forEach(activity => {

                        if (activity.type == 0) {
                            if (activity.name === "ELITE X") {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Green")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });
                            } else if (activity.name === "Server 1") {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });

                            } else if (activity.name === "Server 2") {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });

                            } else if (activity.name === "Server 3") {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });

                            } else if (activity.name === "Server 4") {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });

                            } else if (activity.name === "FiveM") {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Yellow")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });

                            } else if (activity.name === "Server 5") {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });

                            } else {
                                const UserPresenceEmbed = new EmbedBuilder()
                                    .setColor("Blue")
                                    .setDescription(`User: <@${Mention.id}>`)
                                    .setFields(
                                        { name: "Game Name", value: `${activity.name}` }
                                    )
                                return logChan.send({ embeds: [UserPresenceEmbed] });

                            }
                        }
                    });
                }
            }
        }

        if (client.config.DISCORDPRESENCE == true) {
            setInterval(async () => {
                await CheckPresence();
            }, Interval);
        } 
    },
};
