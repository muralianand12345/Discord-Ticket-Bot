const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('carorder')
        .setDescription('Dealership Orders')
        .setDMPermission(false),
    async execute(interaction, client) {

        //log
        const commandName = "CARORDER";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        const User = interaction.member;
        if (!User.roles.cache?.has(client.config.CAR.ROLE_ID)) {
            const replyEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('`You are not Authorised to use this command`')
            return interaction.reply({
                embeds: [replyEmbed],
                ephemeral: true
            });
        }

        await sendMsg().then( async () => {
            const ReplyEmbed = new EmbedBuilder()
                .setColor('Green')
                .setDescription('`Message Sent Sucessfully!`')
            await interaction.reply({ embeds: [ReplyEmbed], ephemeral: true });
        });


        async function sendMsg() {
            const carChan = client.channels.cache.get(client.config.CAR.CHAN_ID);

            const BuEmbed = new EmbedBuilder()
                .setColor("Black")
                .setTitle("`ORDER YOUR CAR HERE!`")
            const BuRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('carorder')
                        .setLabel("ORDER")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('🚗')
                )

            await carChan.send({ embeds: [BuEmbed], components: [BuRow] });
        }
    }
};