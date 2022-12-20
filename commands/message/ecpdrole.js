const {
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'ecpdrole',
    description: "Give ECPD Role",
    cooldown: 2000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {

        //Message Read
        var Message = args.join(" ");
        message.delete();

        //command user info
        const commandUser = message.member;

        //ECPD HO ROLE
        const ECPDHO = client.job.ECPD.HROLE_ID;

        //check for the ecpd role
        if (commandUser.roles.cache?.has(ECPDHO)) {

            //get mentioned user's info function
            function getUserFromMention(mention) {
                if (!mention) return;

                if (mention.startsWith('<@') && mention.endsWith('>')) {
                    mention = mention.slice(2, -1);

                    if (mention.startsWith('!')) {
                        mention = mention.slice(1);
                    }

                    return client.guilds.cache.get(message.guild.id).members.cache.get(mention);
                }
            }

            //user info in variable
            const User = getUserFromMention(Message);

            //check if the user is valid or not
            if (!User) {
                const ReplyEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription('Mention the User!')

                return message.channel.send({
                    content: `<@${message.author.id}>`,
                    embeds: [ReplyEmbed]
                }).then((msg) => {
                    setTimeout(function () {
                        msg.delete()
                    }, 4000);
                });
            }

            //give role function
            async function RoleECPD(User, roleID, logID) {
                var role = await message.guild.roles.cache.get(roleID);
                if (User.roles.cache?.has(roleID)) {
                    //log
                    const mainPage = new EmbedBuilder()
                        .setTitle("ECPD")
                        .setDescription("ROLE REMOVED")
                        .setAuthor({ name: `${commandUser.user.username}`, iconURL: `${commandUser.user.displayAvatarURL()}` })
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${User.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${commandUser.user.id}>`,
                                inline: true,
                            }
                        )

                    //removing role and log
                    await User.roles.remove(role).then(() => {
                        return client.channels.cache.get(logID).send({ embeds: [mainPage] });
                    });

                } else {

                    //log
                    const mainPage = new EmbedBuilder()
                        .setTitle("ECPD")
                        .setDescription("ROLE ADDED")
                        .setAuthor({ name: `${commandUser.user.username}`, iconURL: `${commandUser.user.displayAvatarURL()}` })
                        .setColor('Blue')
                        .addFields(
                            {
                                name: `To`,
                                value: `<@${User.id}>`,
                                inline: true,
                            },
                            {
                                name: `By`,
                                value: `<@${commandUser.user.id}>`,
                                inline: true,
                            }
                        )

                    //adding role and log
                    await User.roles.add(role).then(() => {
                        return client.channels.cache.get(logID).send({ embeds: [mainPage] });
                    });
                }
            }

            //calling function and reply
            const ECPDROLE = client.job.ECPD.ID;
            const LOG = client.job.LOGS.CHAN_ID;
            await RoleECPD(User, ECPDROLE, LOG).then(() => {
                const ReplyEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription('Command Successfully Executed!')

                return message.channel.send({
                    content: `<@${message.author.id}>`,
                    embeds: [ReplyEmbed]
                }).then((msg) => {
                    setTimeout(function () {
                        msg.delete()
                    }, 4000);
                });
            });

        } else {

            //has no ecpd ho role
            const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('You are not **Authorised** to use this command')

            return message.channel.send({
                content: `<@${message.author.id}>`,
                embeds: [ReplyEmbed]
            }).then((msg) => {
                setTimeout(function () {
                    msg.delete()
                }, 4000);
            });
        }
    }
};