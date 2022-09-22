const {SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticketmessageredm')
    .setDescription("Sends Ticket To Ticket Channel!"),
    
    async execute(interaction, client) {
        
        //log
        const commandName = "TICKETMESSAGEREDM";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        //command
        
        try{
    
            if (interaction.user.id === client.config.INFO.OWNER_ID || client.config.INFO.COOWNER_ID) {          

                const Ticket = client.channels.cache.get(client.config.REDM_TICKET.TICKET_MSG.CHAN_ID);
                async function sendTicketMSG() {

                    const embed = new EmbedBuilder()
                    .setColor('#6d6ee8')
                    .setAuthor({ name: "EliteX Roleplay" })
                    .setDescription('```REDM TICKET HERE```')
                    .setFooter({ text: client.config.footerText, iconURL : client.user.avatarURL()})

                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('open-ticket-redm')
                        .setLabel('REDM Ticket')
                        .setEmoji('🎟️')
                        .setStyle(ButtonStyle.Success),
                    );

                    Ticket.send({
                        embeds: [embed],
                        components: [button]
                    })
                }

                sendTicketMSG();
 
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription("Ticket Message Has Been Sent!")
                interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
                
            } else {
                const replyEmbed = new EmbedBuilder()           
                .setColor("Red")           
                .setDescription('You do not have perms to run this command')           
                return interaction.reply({ embeds: [replyEmbed], ephemeral: true });    
            }
     
        } catch(err) {
            const commandName = "ticketmessageredm.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }
        
    }
};
