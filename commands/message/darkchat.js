const {
	EmbedBuilder
} = require('discord.js');

module.exports = {
	name: 'darkchat',
	description: "Send's darkchat anonymous chat",
	cooldown: 20000,
	userPerms: [],
	botPerms: [],
	run: async (client, message, args) => {

		const commandName = `MESS_DARKCHAT`;
		client.std_log.error(client, commandName, message.author.id, message.channel.id);

		message.delete().catch(err => {
			const commandName = "id.js";
			const Line = "Unable To Delete Message";
			return client.err_log.error(client, commandName, message.author.id, message.channel.id, Line, err);
		});

		var Message = args.join(" ");

		const chan_id = client.config.DARK_CHAT.CHAN_ID;
		const channel = client.channels.cache.get(chan_id)

		try {
			const webhooks = await channel.fetchWebhooks();
			const webhook = webhooks.find(wh => wh.token);

			if (!webhook) {
				const ReplyEmbed = new EmbedBuilder()
					.setColor("Green")
					.setDescription('No webhook was found that I can use!')

				return message.reply({
					content: `<@${message.author.id}>`,
					embeds: [ReplyEmbed]
				}).then((msg) => {
					setTimeout(function () {
						msg.delete()
					}, 4000);
				});
			}

			await webhook.send({
				content: Message,
				username: 'Anonymous User',
				avatarURL: 'https://thumbs.dreamstime.com/b/illegal-stamp-illegal-round-grunge-stamp-illegal-sign-illegal-136960672.jpg',
				//embeds: [embed],    
			}).catch(err => {
				const commandName = "id.js";
				const Line = "Unable To Send Webhook";
				return client.err_log.error(client, commandName, message.author.id, message.channel.id, Line, err);
			});

		} catch (err) {
			const commandName = "id.js";
			const Line = "Catch Error";
			return client.err_log.error(client, commandName, message.author.id, message.channel.id, Line, err);
		}
	}
};