const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    name: 'ecmscf',
    description: "Sends ECMS Doctor's only complaint form",
    cooldown: 20000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],
    run: async (client, message, args) => {

        const commandName = `MESS_ECMSCF`;
        client.std_log.error(client, commandName, message.author.id, message.channel.id);

        const ecmsCfChan = "1059451301458616340";

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription('```Complaint Form```')

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ecms-cf')
                    .setEmoji('✉️')
                    .setStyle(ButtonStyle.Danger),
            );

        client.channels.cache.get(ecmsCfChan).send({
            embeds: [embed],
            components: [button]
        })
    }
};