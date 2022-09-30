const { EmbedBuilder } = require('discord.js');

module.exports={
    async error(client,command="unknown",user="unknown",channel="unknown")
    {
        let log_channel=await client.channels.cache.get(client.config.STD_LOG.CHAN_ID);
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('STD Logger')
            .addFields(
                { name:"Command", value:command },
                { name:"User", value:`<@${user}>`},
                { name:"channel", value:`<#${channel}>`}
            );

        await log_channel.send({
            embeds: [embed]
        }).catch(err=>console.log(err));
    }
}