const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('questions')
        .setDescription('Sends EliteX PR Question'),
    async execute(interaction, client) {  
           
        //log
        const commandName = "QUESTIONS";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        try {
            //Check User
            const RoleID = client.config.QUESTIONS.ROLEID;
            const User = interaction.member;
                if (User.roles.cache?.has(`${RoleID}`)) {
    
                    const chan = client.channels.cache.get(interaction.channelId);
                    if (chan.name.includes('ticket')) {
                        //sent message
                        sendMsg();
                        const ReplyEmbed = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription("`A Question has been Sent Successfully!`")
        
                        return interaction.reply({
                            embeds: [ReplyEmbed],
                            ephemeral: true
                        });                
    
                    } else {
                        const ReplyEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("You must be in a ticket to use this command")
      
                        return await interaction.reply({
                            embeds: [ReplyEmbed],
                            ephemeral: true
                        });
                    }
    
                } else {
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("This command is for admins only!")
    
                    return await interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                }
                
            function sendMsg() {
                const ticketChan = interaction.channel.id;
                const reactionRole = client.channels.cache.get(ticketChan);
                const embed = new EmbedBuilder()
                .setColor("Orange")
                .setDescription('```EliteX Exclusive Role```')
    
                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('elitexpr')
                    .setLabel("Start")
                    .setStyle(ButtonStyle.Success),
                );
                reactionRole.send({ embeds: [embed], components: [button] });
            }
            
        } catch(err){
            const commandName = "questions.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }  
    },
};