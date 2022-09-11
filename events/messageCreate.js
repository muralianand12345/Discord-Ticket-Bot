module.exports = {
	name: 'messageCreate',
	execute: async(message) => {

        //Random Replys
        const botReply = [
            "Hello! How can I help you?",
            "Yes, how can I help you?",
            "Raise a ticket, we are happy to help you!",
            "At your service ❤️",
            "Yes Sir!",
            "Official EliteX Roleplay Discord Bot"
        ];
        const randomIndex = Math.floor(Math.random() * (botReply.length - 1) + 1);
        const newActivity = botReply[randomIndex];
        
        let client = message.client;
        if (message.author.bot) return;

        /*if (message.channel.type === 'dm') {
            return message.reply({ content: newActivity });
        }*/

        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            return message.reply({ content: newActivity });
        }
    }
};