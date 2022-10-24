module.exports = {
	name: 'report',
	description: "Get a Report of all Errors",
	cooldown: 20000,
	userPerms: ['Administrator'],
	botPerms: ['Administrator'],
	run: async (client, message, args) => {

		const commandName = `MESS_REPORT`;
		client.std_log.error(client, commandName, message.author.id, message.channel.id);

        client.handle.report(client , message); 
	}
};