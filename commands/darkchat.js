const { 
    SlashCommandBuilder,
    EmbedBuilder
 } = require('discord.js');

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('darkchat')
        .setDescription("Send's anonymous chat")
        .addStringOption(option =>
            option.setName('text')
            .setDescription('Your message here! (Use `\\n` for new line)')
            .setRequired(true)),
    async execute(interaction, client) {

        const text = interaction.options.getString('text') || "No Text";   
            
        //log
        const commandName = "DARKCHAT";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id); 

        try {
            if (cooldown.has(interaction.user.id)) {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Try Again Later (Cooldown)')

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
                
            } else {

                const chan_id = client.config.DARK_CHAT.CHAN_ID;
                const channel = client.channels.cache.get(chan_id);

                /*const embed = new EmbedBuilder()     
                .setTitle('Anonymous')    
                .setColor('#0099ff');*/
    
                const webhooks = await channel.fetchWebhooks();    
                const webhook = webhooks.find(wh => wh.token);

                //searchs if there is any active webhook in the channel    
                if (!webhook) {     
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription('No webhook was found that I can use!')

                    return interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    }); 
                }

                await webhook.send({     
                    content: text,      
                    username: 'Anonymous User',     
                    avatarURL: 'https://thumbs.dreamstime.com/b/illegal-stamp-illegal-round-grunge-stamp-illegal-sign-illegal-136960672.jpg',      
                    //embeds: [embed],    
                });

                const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("```Anonymous Message Has Been Sent```")

                interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });

                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);  
            }          

        } catch(err) {
            const commandName = "darkchat.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }
        
    }
};