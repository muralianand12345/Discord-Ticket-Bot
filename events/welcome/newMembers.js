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
        const formLink = client.visa.LINK;
        const serverLink = client.visa.SERVER_DETAIL;

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setThumbnail(client.visa.LOGO)
            .setTitle(`Welcome to EliteX RP`)
            .setDescription(`[**<@${userID}>, we are delighted to have you among us. On behalf of ELiteX Team, we would like to extend our warmest welcome!**](${serverLink})`)
            .setFields(
                { name: "Apply Here", value: `<#${client.visa.WELCOME.TAGCHAN}>` }
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
        var bool = 0;
        await client.users.cache.get(userID).send({
            embeds: [embed],
            components: [sbutton]
        }).catch(error => {

            //LOG
            if (error.code == 50007) {
                bool = 1;
            }
        });

        if (bool == 1) {
            const logembederr = new EmbedBuilder()
                .setColor('Black')
                .setDescription(`Unable to DM <@${userID}> \`${userName}#${userTag}\` (Apply Form)`)

            return client.channels.cache.get(client.visa.WELCOME.LOGCHAN).send({
                embeds: [logembederr]
            });

        } else if (bool == 0) {
            const logembed = new EmbedBuilder()
                .setColor('Black')
                .setDescription(`DM sent to <@${userID}> \`${userName}#${userTag}\` (Apply Form)`)

            return client.channels.cache.get(client.visa.WELCOME.LOGCHAN).send({
                embeds: [logembed]
            });

        } else {

            return;
        }
    }
}
