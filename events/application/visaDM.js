const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js")

module.exports = {
    name: 'messageCreate',
    execute: async (message, client) => {

        try {
            //ACCEPTED
            const VPChan = client.config.DM_MESSAGE.ACCEPTED.VPCHAN;
            if (message.channel.id === VPChan) {
                if (message.content.includes('<@')) {
                    var mention = message.mentions.users.first();
                    if (mention == null) {
                        return;
                    } else {
                        const mentionID = mention.id;
                        const msgLink = message.url;

                        const embed = new EmbedBuilder()
                            .setColor('Green')
                            .setThumbnail(client.config.DM_MESSAGE.LOGO)
                            .setTitle(`EliteX Voice Process`)
                            .setDescription(`<@${mentionID}>, your **Voice Process Application** has been accepted 😊! Kindly join the <#${client.config.DM_MESSAGE.ACCEPTED.WAITING_HALL}>`)

                        const sbutton = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Message`)
                                    .setEmoji('📑')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(msgLink)
                            )

                        client.users.cache.get(mentionID).send({
                            embeds: [embed],
                            components: [sbutton]
                        }).catch(error => {
                            if (error.code == 50007) {
                                const logembed = new EmbedBuilder()
                                    .setColor('Black')
                                    .setDescription(`Unable to DM <@${mentionID}> (VP Response Acc)`)

                                return client.channels.cache.get(client.config.DM_MESSAGE.ACCEPTED.LOGCHAN).send({
                                    embeds: [logembed]
                                });
                            }
                        })

                        //LOG
                        const logembed = new EmbedBuilder()
                            .setColor('Black')
                            .setDescription(`DM sent to <@${mentionID}> (VP Response Acc)`)

                        client.channels.cache.get(client.config.DM_MESSAGE.ACCEPTED.LOGCHAN).send({
                            embeds: [logembed]
                        });
                    }
                }
            }

        } catch (err) {
            const commandName = "visaDM.js";
            const Line = "Acc Catch Error";
            return client.err_log.error(client, commandName, "No User", "Null", Line, err);
        }

        try {
            //REJECTED
            const RejChan = client.config.DM_MESSAGE.REJECTED.REJCHAN;
            if (message.channel.id === RejChan) {
                if (message.content.includes('<@')) {
                    var mention = message.mentions.users.first();
                    if (mention == null) {
                        return;
                    } else {
                        const mentionID = mention.id;
                        const msgLink = message.url;

                        const embed = new EmbedBuilder()
                            .setColor('Red')
                            .setThumbnail(client.config.DM_MESSAGE.LOGO)
                            .setTitle(`EliteX Voice Process`)
                            .setDescription(`<@${mentionID}>, your **Voice Process Application** has been rejected 😓! Kindly reapply after 2 days <#${client.config.DM_MESSAGE.REJECTED.APPLYCHAN}>\nServer Rules: <#${client.config.DM_MESSAGE.REJECTED.RULECHAN}>`)

                        const sbutton = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(`Message`)
                                    .setEmoji('📑')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(msgLink)
                            )

                        client.users.cache.get(mentionID).send({
                            embeds: [embed],
                            components: [sbutton]
                        }).catch(error => {
                            if (error.code == 50007) {
                                const logembed = new EmbedBuilder()
                                    .setColor('Black')
                                    .setDescription(`Unable to DM <@${mentionID}> (VP Response Rej)`)

                                return client.channels.cache.get(client.config.DM_MESSAGE.REJECTED.LOGCHAN).send({
                                    embeds: [logembed]
                                });
                            }
                        })

                        //LOG
                        const logembed = new EmbedBuilder()
                            .setColor('Black')
                            .setDescription(`DM sent to <@${mentionID}> (VP Response Rej)`)

                        client.channels.cache.get(client.config.DM_MESSAGE.REJECTED.LOGCHAN).send({
                            embeds: [logembed]
                        });
                    }
                }
            }
            
        } catch (err) {
            const commandName = "visaDM.js";
            const Line = "Rej Catch Error";
            return client.err_log.error(client, commandName, "No User", "Null", Line, err);
        }
    }
}