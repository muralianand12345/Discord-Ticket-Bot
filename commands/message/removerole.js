const {
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'rmrole',
    description: "Removes Specific role from all users",
    cooldown: 1000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],
    run: async (client, message, args) => {

        const commandName = `MESS_RMROLE`;
        client.std_log.error(client, commandName, message.author.id, message.channel.id);

        var roleID = args.join(" ");
        await message.delete();

        //blacklist role

        function blacklistembed() {
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Black Listed Role')

            return message.channel.send({
                embeds: [ReplyEmbed],
                content: `<@${message.author.id}>`,
            }).then((msg) => {
                setTimeout(function () {
                    msg.delete()
                }, 4000);
            });
        }

        if (roleID.includes('1058684212175192105')) {
            return blacklistembed();
        } else if (roleID.includes('1058684128167469088')) {
            return blacklistembed();
        } else if (roleID.includes('1058684181254783016')) {
            return blacklistembed();
        }

        let roleInfo = await message.guild.roles.cache.find(x => x.id === roleID);

        if (roleInfo == undefined) {

            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Role does not exist!')

            return message.channel.send({
                embeds: [ReplyEmbed],
                content: `<@${message.author.id}>`,
            }).then((msg) => {
                setTimeout(function () {
                    msg.delete()
                }, 4000);
            });
        }

        await message.guild.members.cache.forEach(async (member) => {
            await member.roles.remove(roleID);
        });
    }
};