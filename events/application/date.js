const moment = require('moment');
const tz = require('moment-timezone');
var colors = require('colors/safe');

module.exports = {
    name: 'ready',
    async execute(client) {

        //Date
        try {
            const needDatenTime = client.config.DATE.ENABLE;

            if (needDatenTime == true) {
                console.log(colors.green.underline('Date and Time has been enabled'));
                const TIMEZONE = client.config.DATE.TIMEZONE;
                const FORMAT = client.config.DATE.FORMATDATE;
                const CHANNEL_ID = client.config.DATE.CHAN_ID;
                const UPDATE_INTERVAL = client.config.DATE.UPDATE_INTERVAL;
    
                const timeNow = moment().tz(TIMEZONE).format(FORMAT);
                const clockChannel = client.channels.cache.get(CHANNEL_ID);
                await clockChannel.edit({ name: `🕒 ${timeNow}` }, 'Clock update').catch(console.error);
    
                setInterval( async() => {
                    const timeNowUpdate = moment().tz(TIMEZONE).format(FORMAT);
                    await clockChannel.edit({ name: `🕒 ${timeNowUpdate}` }, 'Clock update').catch(console.error);
                }, UPDATE_INTERVAL);
    
            } else if (needDatenTime == false) {
                console.log(colors.red.underline('Date and Time has been disabled'));
            } else {
                console.log(colors.trap('Error Has been occured at Time and Date!'));
            }

        } catch(err) {
            const commandName = "ready.js";
            const Line = "No/Slow Internet | Date and Time";
            return client.err_log.error(client,commandName,"Unknown","Date and Time VC",Line,err);
        }
    }
}