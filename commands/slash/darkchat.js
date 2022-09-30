const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    cooldown: 30000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('darkchat')
        .setDescription("Send's anonymous chat")
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Your message here! (Use `\\n` for new line)')
                .setRequired(true)),
    async execute(interaction, client) {

        const text = interaction.options.getString(`text`) || "No Text";

        //log
        const commandName = "DARKCHAT";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        try {


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



        } catch (err) {
            const commandName = "darkchat.js";
            const Line = "Catch Error";
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }

    }
};