const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    cooldown: 10000,

    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Sends EliteX RP Server Invite Link")
        .setDMPermission(true),
    async execute(interaction, client) {

        //log
        const commandName = "INVITE";
        var chanID;
        if (interaction.channel == null) {
            chanID = "DM";
        } else {
            chanID = interaction.channel.id;
        }
        client.std_log.error(client, commandName, interaction.user.id, chanID);


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("EliteX RP")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.gg/jPSbpsjb4r")
            );
        const mainPage = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .setColor('#303236')
            .addFields({ name: '**Join ELiteX RP**', value: `[Here](https://discord.gg/jPSbpsjb4r)` })

        interaction.reply({ embeds: [mainPage], components: [row] })
    }
};