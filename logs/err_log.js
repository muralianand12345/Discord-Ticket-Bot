const { EmbedBuilder } = require('discord.js');

module.exports={

    async error(client,file="unknown",user="unknown",channel="unknown",line="unknown",err="unknown")
    {   
        let log_channel=await client.channels.cache.get(client.config.ERR_LOG.CHAN_ID);
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('Error Logger')
            .setDescription(err)
            .addFields(
                { name:"File", value:file },
                { name:"User", value:`<@${user}>`},
                { name:"channel", value:`<#${channel}>`},
                { name:"line", value:line},
            );

        await log_channel.send({
            content: client.config.ERR_LOG.ERR_TAG,
            embeds: [embed]
        }).catch(err=>console.log(err));
    }
}