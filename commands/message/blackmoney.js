const {
	EmbedBuilder
} = require('discord.js');

module.exports = {
	name: 'blackdeal',
	description: "Message only for Black Money Dealers",
	cooldown: 10000,
	userPerms: [],
	botPerms: [],
	run: async (client, message, args) => {

		const commandName = `MESS_BLACKDEAL`;
		client.std_log.error(client, commandName, message.author.id, message.channel.id);

		message.delete().catch(err => {
			const commandName = "blackdeal.js";
			const Line = "Unable To Delete Message";
			return client.err_log.error(client, commandName, message.author.id, message.channel.id, Line, err);
		});

		var Message = args.join(" ");

		const chan_id = client.config.DARK_CHAT.CHAN_ID;
		const channel = client.channels.cache.get(chan_id)
        const BlackMoney = client.config.DARK_CHAT.BLACK_MONEY;

		const commandUser = message.member;
        
        if ( !commandUser.roles.cache?.has(BlackMoney)) {
            const replyEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription("Yaaru Da Nee Lmao ...")
            
            return message.channel.send({ 
                content: `<@${message.author.id}>`,
                embeds: [replyEmbed]
            }).then((msg) => {
                setTimeout( function() {
                    msg.delete()
                }, 4000);
            });
        }

		try {
			const webhooks = await channel.fetchWebhooks();
			const webhook = webhooks.find(wh => wh.token);

			if (!webhook) {
				const ReplyEmbed = new EmbedBuilder()
					.setColor("Green")
					.setDescription('No webhook was found that I can use!')
				return message.channel.send({
					content: `<@${message.author.id}>`,
					embeds: [ReplyEmbed]
				}).then((msg) => {
					setTimeout(function () {
						msg.delete()
					}, 4000);
				});
			}

			const blackReply = new EmbedBuilder()
			.setColor('Black')
			.setDescription(`\`\`\`${Message}\`\`\``)

			await webhook.send({
				//content: Message,
				username: 'Black Money',
				avatarURL: 'https://i.pinimg.com/originals/56/16/ca/5616ca8881301ea7fdbb184c7131eb29.png',
				embeds: [blackReply],    
			});

		} catch (err) {
			const commandName = "blackdeal.js";
			const Line = "Catch Error";
			return client.err_log.error(client, commandName, message.author.id, message.channel.id, Line, err);
		}
	}
};