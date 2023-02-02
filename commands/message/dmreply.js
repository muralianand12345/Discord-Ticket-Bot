const {
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: 'dmuseradmin',
    description: "Sends user DM reply",
    cooldown: 1000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],
    run: async (client, message, args) => {

        const commandName = `MESS_DMUSER`;
        client.std_log.error(client, commandName, message.author.id, message.channel.id);

        var User = args[0];
        var Message = args.slice(1).join(" ");

        const userDM = client.users.cache.get(User);
        if (!userDM) {
            return message.reply({
                content: 'User does not exist!',
            });
        }

        //logs
        const logembed = new EmbedBuilder()
            .setDescription(Message || '**No Message**')
            .addFields(
                { name: 'To', value: userDM.tag || '**Null**' },
                { name: 'To (ID)', value: userDM.id || '**Null**' },
                { name: 'By', value: message.author.tag || '**Null**' }
            );

        return await userDM.send({ content: Message }).then(async () => {
            client.channels.cache.get(client.config.DMREPLY.REPLY).send({ embeds: [logembed] });
        });
    }
};