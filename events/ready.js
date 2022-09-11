const { EmbedBuilder, ActivityType } = require('discord.js');
const moment = require('moment');
const tz = require('moment-timezone');

module.exports = {
    name: 'ready',
    execute(client) {
        console.log(`${client.user.tag} Bot is ready to rock n roll!`);

        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid); 

        const activities = [
            { name: `your Queries 24/7!`, type: ActivityType.Listening },
            { name: `EliteX RolePlay ❤️`, type: ActivityType.Playing },
            { name: `${client.users.cache.size} Users`, type: ActivityType.Watching },
            { name: `Discord.js v14`, type: ActivityType.Competing }
        ];

        let i = 0;
        setInterval(() => {
            if(i >= activities.length) i = 0
		    client.user.setActivity(activities[i])
		    i++;
        }, 5000);

        //Date
        try {
            const needDatenTime = client.config.DATE.ENABLE;

            if (needDatenTime == "true") {
                console.log('Date and Time has been enabled');
                const TIMEZONE = client.config.DATE.TIMEZONE;
                const FORMAT = client.config.DATE.FORMATDATE;
                const CHANNEL_ID = client.config.DATE.CHAN_ID;
                const UPDATE_INTERVAL = client.config.DATE.UPDATE_INTERVAL;
    
                const timeNow = moment().tz(TIMEZONE).format(FORMAT);
                const clockChannel = client.channels.cache.get(CHANNEL_ID);
                clockChannel.edit({ name: `🕒 ${timeNow}` }, 'Clock update').catch(console.error);
    
                setInterval(() => {
                    const timeNowUpdate = moment().tz(TIMEZONE).format(FORMAT);
                    clockChannel.edit({ name: `🕒 ${timeNowUpdate}` }, 'Clock update').catch(console.error);
                }, UPDATE_INTERVAL);
    
            } else if (needDatenTime == "false") {
                console.log('Date and Time has been disabled');
            } else {
                console.log('Error Has been occured at Time and Date!');
            }

        } catch(err) {
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "Date and Time Error", value: `Reason: No/Slow Internet`}
            )
            err_logchan.send({ content: `${errTag}`, embeds: [errEmbed] });
        }
        
        //Restart Embed Message
        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`Bot Restart Completed and Online ❤️`)
            .setTimestamp();
        err_logchan.send({ embeds:[embed] });
    },
};