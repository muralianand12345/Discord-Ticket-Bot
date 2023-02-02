const {
    EmbedBuilder,
    Events
} = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) {
            return;
        }
        if (message.guild) return;

        const LogID = client.config.DMREPLY.DM;

        await message.attachments.forEach(async (value, key) => {
            var media = value['url'];

            const mediaembed = new EmbedBuilder()
                .setTitle('DM Media')
                .setDescription(`Media Link: ${media}`)
                .setFooter({ text: message.author.tag })
                .addFields(
                    { name: 'User ID', value: message.author.id },
                    { name: 'Key', value: key || '**Null**' }
                );
            await client.channels.cache.get(LogID).send({ embeds: [mediaembed] });
        });

        const embed = new EmbedBuilder()
            .setTitle('DM Message')
            .setDescription(message.content || '**No Message**')
            .setFooter({ text: message.author.tag })
            .addFields(
                { name: 'User ID', value: message.author.id }
            );

        await client.channels.cache.get(LogID).send({ embeds: [embed] });
    }
};