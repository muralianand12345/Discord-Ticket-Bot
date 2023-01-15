const {
    ChannelType,
    Events
} = require('discord.js');

const discordTranscripts = require('discord-html-transcripts');
require("dotenv").config();
const fs = require('fs');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        if (client.config.ENABLE.AUTOTICKET == true) {

            const GuildID = "939507689283784735";
            const Interval = 10800000;

            const Guild = client.guilds.cache.get(GuildID)

            setInterval(async () => {
                var arr = [];
                await Guild.channels.cache.forEach(async (chan) => {
                    if (chan.name.includes('ticket') && chan.type == ChannelType.GuildText) {
                        arr.push(chan)
                    }
                });

                arr.forEach(async (chan) => {

                    if (chan == null) {
                        return;
                    } else {
                        const htmlCode = await discordTranscripts.createTranscript(chan, {
                            limit: -1,
                            returnType: 'string',
                            filename: `transcript-${chan.id}.html`,
                            saveImages: false,
                            poweredBy: false
                        });

                        fs.writeFile(`./ticket-logs/transcript-${chan.id}.html`, htmlCode, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });

            }, Interval);
        }
    }
};