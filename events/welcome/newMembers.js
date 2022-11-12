const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js")

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const userID = member.user.id;
        const userName = member.user.username;
        const userTag = member.user.discriminator;
        const formLink = client.config.DM_MESSAGE.LINK;
        const serverLink = client.config.DM_MESSAGE.SERVER_DETAIL;

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setThumbnail(client.config.DM_MESSAGE.LOGO)
            .setTitle(`Welcome to EliteX RP`)
            .setDescription(`[**<@${userID}>, we are delighted to have you among us. On behalf of ELiteX Team, we would like to extend our warmest welcome!**](${serverLink})`)
            .setFields(
                { name: "Apply Here", value: `<#${client.config.DM_MESSAGE.WELCOME.TAGCHAN}>` }
            )

        const sbutton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Apply Here`)
                    .setEmoji('📲')
                    .setStyle(ButtonStyle.Link)
                    .setURL(formLink)
            )

        //DM
        client.users.cache.get(userID).send({
            embeds: [embed],
            components: [sbutton]
        }).catch(error => {

            //LOG
            if (error.code == 50007) {
                const logembederr = new EmbedBuilder()
                    .setColor('Black')
                    .setDescription(`Unable to DM <@${userID}> \`${userName}#${userTag}\` (Apply Form)`)

                return client.channels.cache.get(client.config.DM_MESSAGE.WELCOME.LOGCHAN).send({
                    embeds: [logembederr]
                });
            } else {
                const logembed = new EmbedBuilder()
                    .setColor('Black')
                    .setDescription(`DM sent to <@${userID}> \`${userName}#${userTag}\` (Apply Form)`)

                client.channels.cache.get(client.config.DM_MESSAGE.WELCOME.LOGCHAN).send({
                    embeds: [logembed]
                });
            }
        })
    }
}
