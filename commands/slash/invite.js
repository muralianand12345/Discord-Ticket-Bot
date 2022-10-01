const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Sends EliteX RP Server Invite Link"),
    async execute(interaction, client) {

        //log
        const commandName = "INVITE";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        try {
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

        } catch (err) {
            const commandName = "invite.js";
            const Line = "Catch Error";
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }

    }
};