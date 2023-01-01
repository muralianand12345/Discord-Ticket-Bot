const {
    EmbedBuilder,
    Events
} = require('discord.js');


module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel, client) {

        //name update
        if (oldChannel.name !== newChannel.name) {
            const logEmbed = new EmbedBuilder()
                .setColor('Black')
                .setAuthor({ name: `Channel name changed`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Channel:**`,
                    ``,
                    `Name: **${newChannel.name}**`,
                    `Mention: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Guild`, value: `${oldChannel.guild.name}`, inline: true },
                    { name: `From`, value: `${oldChannel.name}`, inline: true },
                    { name: `To`, value: `${newChannel.name}`, inline: true }
                )
                .setTimestamp()

            client.channels.cache.get(client.glog.GUILD.CHAN).send({
                embeds: [logEmbed]
            });
        }

        //nsfw update
        if (oldChannel.nsfw !== newChannel.nsfw) {
            const logEmbed = new EmbedBuilder()
                .setColor('Black')
                .setAuthor({ name: `Channel Age Restriction updated`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Channel:**`,
                    ``,
                    `Name: **${newChannel.name}**`,
                    `Mention: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Guild`, value: `${oldChannel.guild.name}`, inline: true },
                    { name: `Old Restriction:`, value: `${oldChannel.nsfw ? 'Enabled :white_check_mark:' : 'Disabled :x:'}`, inline: true },
                    { name: `New Restriction:`, value: `${newChannel.nsfw ? 'Enabled :white_check_mark:' : 'Disabled :x:'}`, inline: true }
                )
                .setTimestamp()

            client.channels.cache.get(client.glog.GUILD.CHAN).send({
                embeds: [logEmbed]
            });
        }

        //parent/category update
        if (oldChannel.parent !== newChannel.parent) {
            const logEmbed = new EmbedBuilder()
                .setColor('Black')
                .setAuthor({ name: `Channel category changed`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Channel:**`,
                    ``,
                    `Name: **${newChannel.name}**`,
                    `Mention: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Guild`, value: `${oldChannel.guild.name}`, inline: true },
                    { name: `From`, value: `${oldChannel.parent}`, inline: true },
                    { name: `To`, value: `${newChannel.parent}`, inline: true }
                )
                .setTimestamp()

            client.channels.cache.get(client.glog.GUILD.CHAN).send({
                embeds: [logEmbed]
            });
        }

        //topic update
        if (oldChannel.topic !== newChannel.topic) {
            const logEmbed = new EmbedBuilder()
                .setColor('Black')
                .setAuthor({ name: `Channel topic changed`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Channel:**`,
                    ``,
                    `Name: **${newChannel.name}**`,
                    `Mention: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Guild`, value: `${oldChannel.guild.name}`, inline: true },
                    { name: `From`, value: `${oldChannel.topic || `None :x:`}`, inline: true },
                    { name: `To`, value: `${newChannel.topic || `None :x:`}`, inline: true },
                )
                .setTimestamp()

            client.channels.cache.get(client.glog.GUILD.CHAN).send({
                embeds: [logEmbed]
            });
        }

        //slowmode update
        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
            const logEmbed = new EmbedBuilder()
                .setColor('Black')
                .setAuthor({ name: `Channel slowmode changed`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Channel:**`,
                    ``,
                    `Name: **${newChannel.name}**`,
                    `Mention: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Guild`, value: `${oldChannel.guild.name}`, inline: true },
                    { name: `Old Slowmode:`, value: `${oldChannel.rateLimitPerUser || 'None'}`, inline: true },
                    { name: `New Slowmode:`, value: `${newChannel.rateLimitPerUser || 'None'}`, inline: true },
                )
                .setTimestamp()

            client.channels.cache.get(client.glog.GUILD.CHAN).send({
                embeds: [logEmbed]
            });
        }
    }
}