const { 
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('ticketmessagefivem')
        .setDescription("Sends Ticket To Ticket Channel!"),

    async execute(interaction, client) {

        //log
        const commandName = "TICKETMESSAGEFIVEM";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        //command

        try {
            const Ticket = client.channels.cache.get(client.config.FIVEM_TICKET.TICKET_MSG.CHAN_ID);
            async function sendTicketMSG() {

                const embed = new EmbedBuilder()
                    .setColor('#6d6ee8')
                    .setAuthor({ name: "EliteX Roleplay" })
                    .setDescription('```FIVEM TICKET HERE```')
                    .setFooter({ text: client.config.footerText, iconURL: client.user.avatarURL() })

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


        } catch (err) {
            const commandName = "ticketmessagefivem.js";
            const Line = "Catch Error";
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }
    }
};