const {
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'rolecheck',
    description: "Sends user whith common role",
    cooldown: 20000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {

        const commandName = `MESS_ROLECHECK`;
        client.std_log.error(client, commandName, message.author.id, message.channel.id);

        const Role1ID = client.config.ROLE_CHECK.ROLE1;
        const Role2ID = client.config.ROLE_CHECK.ROLE2;
        const GuildId = client.config.ROLE_CHECK.GUILDID;

        GuildInfo = await client.guilds.cache.get(GuildId);

        var Role1 = await GuildInfo.roles.cache.find(role => role.id == Role1ID);
        var Role2 = await GuildInfo.roles.cache.find(role => role.id == Role2ID);

        var Role1_Total = await Role1.members.map(m => m.user);
        var Role2_Total = await Role2.members.map(m => m.user);

        var Role_Total = Role1_Total.filter((element) => {
            return Role2_Total.includes(element);
        });

        var List;
        for (var i = 0; i < Role_Total.length; i++) {
            List += `<@${Role_Total[i].id}>`;
        }

        const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`**Common Roles:** ${List.substring(9)}`)

        message.channel.send({ embeds: [embed] });
    }
};