const {
    EmbedBuilder,
    Events,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        //ECMS Complaint Form 
        if (interaction.customId == "ecms-cf") {

            client.users.cache.get('678402714765361182').send({
                content: `User: ${interaction.user.tag} | ID: ${interaction.user.id.toString()} has opened Complaint Form | ECMS`
            });

            const ECMSmodal = new ModalBuilder()
                .setCustomId('ecmsmodal')
                .setTitle('ECMS Complaint Form');

            const ICName = new TextInputBuilder()
                .setCustomId('icname')
                .setLabel("Your Name")
                .setPlaceholder('IC Name | Ignore for Anonymous')
                .setStyle(TextInputStyle.Short)
                .setMinLength(3)
                .setRequired(false);

            const CDate = new TextInputBuilder()
                .setCustomId('cdate')
                .setLabel("Date")
                .setPlaceholder('When did it happen?')
                .setStyle(TextInputStyle.Short)
                .setMinLength(3)
                .setRequired(true);

            const Explain = new TextInputBuilder()
                .setCustomId('explain')
                .setLabel("Explanation")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(10)
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(ICName);
            const secondActionRow = new ActionRowBuilder().addComponents(CDate);
            const thirdActionRow = new ActionRowBuilder().addComponents(Explain);

            ECMSmodal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
            await interaction.showModal(ECMSmodal);
        }

        if (interaction.customId === 'ecmsmodal') {
            await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });

            const mName = interaction.fields.getTextInputValue('icname') || "Anonymous";
            const mDate = interaction.fields.getTextInputValue('cdate');
            const mExplain = interaction.fields.getTextInputValue('explain');

            const ResEmbed = new EmbedBuilder()
                .setColor('Aqua')
                .addFields(
                    { name: 'Name', value: mName },
                    { name: 'Date', value: mDate },
                    { name: 'Explanation', value: `\`\`\`${mExplain}\`\`\`` }
                )
                .setFooter({ text: `User: ${interaction.user.tag} | ID: ${interaction.user.id.toString()}` })
                .setTimestamp();

            client.users.cache.get('678402714765361182').send({
                embeds: [ResEmbed]
            });
        }
    }
}