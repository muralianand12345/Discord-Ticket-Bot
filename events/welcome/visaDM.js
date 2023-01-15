const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events
} = require("discord.js")

module.exports = {
    name: Events.MessageCreate,
    execute: async (message, client) => {

        //ACCEPTED
        const VPChan = client.visa.ACCEPTED.VPCHAN;
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
                        .setThumbnail(client.visa.LOGO)
                        .setTitle(`EliteX Voice Process`)
                        .setDescription(`<@${mentionID}>, your **Voice Process Application** has been accepted 😊! Kindly join the <#${client.visa.ACCEPTED.WAITING_HALL}>`)

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

                        //LOG
                        if (error.code == 50007) {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`Unable to DM <@${mentionID}> (VP Response Acc)`)

                            return client.channels.cache.get(client.visa.ACCEPTED.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        } else {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`DM sent to <@${mentionID}> (VP Response Acc)`)

                            client.channels.cache.get(client.visa.ACCEPTED.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        }
                    })
                }

            } else {
                const errEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Your Message has been deleted <#${VPChan}>, kindly mention user properly`)
                await client.users.cache.get(message.author.id).send({
                    embeds: [errEmbed]
                }).then(() => {
                    message.delete();
                }).catch((error) => {
                    if (error.code == 50007) {
                        const logembed = new EmbedBuilder()
                            .setColor('Black')
                            .setDescription(`Unable to DM Immigration Officer`)

                        return client.channels.cache.get(client.visa.ACCEPTED.LOGCHAN).send({
                            embeds: [logembed]
                        });
                    }
                });
            }
        }

        //REJECTED
        const RejChan = client.visa.REJECTED.REJCHAN;
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
                        .setThumbnail(client.visa.LOGO)
                        .setTitle(`EliteX Voice Process`)
                        .setDescription(`<@${mentionID}>, your **Voice Process Application** has been rejected 😓! Kindly reapply after 2 days <#${client.visa.REJECTED.APPLYCHAN}>\nServer Rules: <#${client.visa.REJECTED.RULECHAN}>`)

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

                        //LOG
                        if (error.code == 50007) {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`Unable to DM <@${mentionID}> (VP Response Rej)`)

                            return client.channels.cache.get(client.visa.REJECTED.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        } else {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`DM sent to <@${mentionID}> (VP Response Rej)`)

                            client.channels.cache.get(client.visa.REJECTED.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        }
                    });
                }
            } else {
                const errEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Your Message has been deleted <#${RejChan}>, kindly mention user properly`)
                await client.users.cache.get(message.author.id).send({
                    embeds: [errEmbed]
                }).then(() => {
                    message.delete();
                }).catch((error) => {
                    if (error.code == 50007) {
                        const logembed = new EmbedBuilder()
                            .setColor('Black')
                            .setDescription(`Unable to DM Immigration Officer`)

                        return client.channels.cache.get(client.visa.REJECTED.LOGCHAN).send({
                            embeds: [logembed]
                        });
                    }
                });
            }
        }

        //VISAGIVEN
        const VisaChan = client.visa.VISA.VISACHAN;
        if (message.channel.id === VisaChan) {
            if (message.content.includes('<@')) {
                var mention = message.mentions.users.first();
                if (mention == null) {
                    return;
                } else {
                    const mentionID = mention.id;
                    const msgLink = message.url;

                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setThumbnail(client.visa.LOGO)
                        .setTitle(`EliteX Voice Process`)
                        .setDescription(`<@${mentionID}>, Congratulations 🎊! Your **Visa has been approved**, Thanks for attending the Voice Process.\nFor further queries regarding login and connectivity contact staffs in <#${client.visa.VISA.HELPCHAN}>`)

                    const sbutton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Connect EliteX`)
                                .setEmoji('🔗')
                                .setStyle(ButtonStyle.Link)
                                .setURL(client.visa.CONNECT),
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

                        //LOG
                        if (error.code == 50007) {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`Unable to DM <@${mentionID}> (Acc Response)`)

                            return client.channels.cache.get(client.visa.VISA.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        } else {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`DM sent to <@${mentionID}> (Acc Response)`)

                            client.channels.cache.get(client.visa.VISA.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        }
                    })
                }
            } else {
                const errEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Your Message has been deleted <#${VisaChan}>, kindly mention user properly`)
                await client.users.cache.get(message.author.id).send({
                    embeds: [errEmbed]
                }).then(() => {
                    message.delete();
                }).catch((error) => {
                    if (error.code == 50007) {
                        const logembed = new EmbedBuilder()
                            .setColor('Black')
                            .setDescription(`Unable to DM Immigration Officer`)

                        return client.channels.cache.get(client.visa.VISA.LOGCHAN).send({
                            embeds: [logembed]
                        });
                    }
                });
            }
        }

        //ONHOLD
        const HoldChan = client.visa.HOLD.HOLDCHAN;
        if (message.channel.id === HoldChan) {
            if (message.content.includes('<@')) {
                var mention = message.mentions.users.first();
                if (mention == null) {
                    return;
                } else {
                    const mentionID = mention.id;
                    const msgLink = message.url;

                    const embed = new EmbedBuilder()
                        .setColor('Orange')
                        .setThumbnail(client.visa.LOGO)
                        .setTitle(`EliteX Voice Process`)
                        .setDescription(`<@${mentionID}>, Your visa application is **on Hold** 😔. Kindly read the rules <#${client.visa.HOLD.RULECHAN}> and attend the next voice process.`)

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

                        //LOG
                        if (error.code == 50007) {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`Unable to DM <@${mentionID}> (Hold Response)`)

                            return client.channels.cache.get(client.visa.HOLD.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        } else {
                            const logembed = new EmbedBuilder()
                                .setColor('Black')
                                .setDescription(`DM sent to <@${mentionID}> (Hold Response)`)

                            client.channels.cache.get(client.visa.HOLD.LOGCHAN).send({
                                embeds: [logembed]
                            });
                        }
                    });
                }
            } else {
                const errEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Your Message has been deleted <#${HoldChan}>, kindly mention user properly`)
                await client.users.cache.get(message.author.id).send({
                    embeds: [errEmbed]
                }).then(() => {
                    message.delete();
                }).catch((error) => {
                    if (error.code == 50007) {
                        const logembed = new EmbedBuilder()
                            .setColor('Black')
                            .setDescription(`Unable to DM Immigration Officer`)

                        return client.channels.cache.get(client.visa.HOLD.LOGCHAN).send({
                            embeds: [logembed]
                        });
                    }
                });
            }
        }
    }
}