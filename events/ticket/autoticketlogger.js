const {
    ChannelType
} = require('discord.js');

const discordTranscripts = require('discord-html-transcripts');
require("dotenv").config();
const fs = require('fs');

module.exports = {
    name: 'ready',
    async execute(client) {

        const runLog = client.config.AUTO_TICKET_LOG.ENABLE;
        if (runLog === true) {
            const GuildID = client.config.AUTO_TICKET_LOG.GUILD_ID;
            const TicName = client.config.AUTO_TICKET_LOG.CHAN_NAME;
            const Interval = client.config.AUTO_TICKET_LOG.INTERVAL;

            const Guild = client.guilds.cache.get(GuildID)

            setInterval(async () => {
                var arr = [];
                await Guild.channels.cache.forEach(async (chan) => {
                    if (chan.name.includes(TicName) && chan.type == ChannelType.GuildText) {
                        arr.push(chan)
                    }
                });

                await arr.forEach(async (chan) => {

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

        } else {
            return console.log("Auto Log Disabled")
        }
    },
};
