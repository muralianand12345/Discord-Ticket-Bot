var colors = require('colors/safe');
const { 
    EmbedBuilder, 
    ActivityType 
} = require('discord.js');

module.exports = {
    name: 'ready',
    execute(client) {
        console.log(colors.rainbow(`${client.user.tag} Bot is ready to rock n roll!`));

        //Err
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid); 

        const activities = [
            { name: `your Queries 24/7!`, type: ActivityType.Listening },
            { name: `EliteX RolePlay ❤️`, type: ActivityType.Playing },
            { name: `${client.users.cache.size} Users!`, type: ActivityType.Watching },
            { name: `#zeroLeaksFiveMServer`, type: ActivityType.Competing }
        ];

        let i = 0;
        setInterval(() => {
            if(i >= activities.length) i = 0
		    client.user.setActivity(activities[i]);
		    i++;
        }, 5000);

        //Restart Embed Message
        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(`Bot Restart Completed and Online ❤️`)
            .setTimestamp();
        err_logchan.send({ embeds:[embed] });
    },
};