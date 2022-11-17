const Chatbot = require("discord-chatbot");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'messageCreate',
    execute: async (message, client) => {

        if (client.config.ENABLE.CHATBOT == true) {

            const chatChan = client.chatbot.CHANID;
            const BotName = client.chatbot.BOT_NAME;
            const BotGender = client.chatbot.BOT_GENDER;

            if (message.channel.id === chatChan) {

                if (message.author.bot) {
                    return;
                }

                const chatbot = new Chatbot({ name: BotName, gender: BotGender });

                var chanArg = message.content;
                var chatMsg = chanArg.toLowerCase()
                if (chatMsg.includes("who made") || chatMsg.includes("who create")) {
                    return message.reply('I was created by Murali Anand.')
                }

                chatbot.chat(chatMsg).then(response => {
                    message.reply(response).catch(e => {
                        if (e.code == 50035) {
                            const codeembed = new EmbedBuilder()
                                .setColor('Red')
                                .setDescription('`Error has occured | Has been notified to Devs`')
                            message.reply({ embeds: [codeembed] });
                            console.log(`Error Response: ${response}`);
                        }
                    });
                }).catch(e => {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('`Error has occured | Has been notified to Devs`')
                    message.reply({ embeds: [embed] });
                });
            }
        }
    }
}