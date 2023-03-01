const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('darkchats')
        .setDescription("Send's anonymous chat")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Your message here! (Use `\\n` for new line)')
                .setRequired(true)),
    async execute(interaction, client) {

        const text = interaction.options.getString(`text`) || "No Text";

        if (text.includes('@here') || text.includes('@everyone')) {
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Tagging "everyone" or "here" is not permitted')

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        //log
        const commandName = "DARKCHAT";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        const chan_id = client.config.DARK_CHAT.CHAN_ID;
        const channel = client.channels.cache.get(chan_id);
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
            content: `${text}`,
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


    }
};