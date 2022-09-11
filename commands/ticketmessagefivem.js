const { SlashCommandBuilder,
    EmbedBuilder, 
    ActionRowBuilder,
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticketmessagefivem')
    .setDescription("Sends Ticket To Ticket Channel!"),
    
    async execute(interaction, client) {
        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
            
        //log
        const commandName = "TicketMessageFIVEM";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]});
    
        //command

        try{
    
            if (interaction.user.id === client.config.INFO.OWNER_ID || client.config.INFO.COOWNER_ID) {          

                const Ticket = client.channels.cache.get(client.config.FIVEM_TICKET.TICKET_MSG.CHAN_ID);
                async function sendTicketMSG() {

                    const embed = new EmbedBuilder()
                    .setColor('#6d6ee8')
                    .setAuthor({ name: "EliteX Roleplay" })
                    .setDescription('```FIVEM TICKET HERE```')
                    .setFooter({ text: client.config.footerText, iconURL : client.user.avatarURL()})

                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('open-ticket-fivem')
                        .setLabel('FIVEM Ticket')
                        .setEmoji('🎫')
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
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            err_logchan.send({ content: `${errTag}`, embeds: [errEmbed] });
        } 
    }
};
