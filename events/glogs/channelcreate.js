const {
    EmbedBuilder,
    Events
} = require('discord.js');
const moment = require('moment');

//CHANNEL CREATE
module.exports = {
    name: Events.ChannelCreate,
    async execute(channel, client) {

        const logEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('New channel has been created')
            .addFields(
                { name: `Guild`, value: `${channel.guild.name}`, inline: true },
                { name: `Name`, value: `${channel.name}`, inline: true },
                { name: `ID`, value: `${channel.id}`, inline: true },
                { name: `Mention`, value: `<#${channel.id}>`, inline: true },
                { name: `NSFW`, value: `${channel.nsfw ? 'Yes :white_check_mark:' : 'No :x:'}`, inline: true },
                { name: `Created at`, value: `${moment.utc(channel.createdAt).format("LLL")}`, inline: true }
            )
            .setTimestamp()

        client.channels.cache.get(client.glog.GUILD.CHAN).send({
            embeds: [logEmbed]
        });
    }
}