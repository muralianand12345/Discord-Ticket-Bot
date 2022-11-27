const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ready',
    async execute(client) {

        if (client.config.ENABLE.NICKNAME == true) {

            const GuildId = client.nickname.GUILDID;
            const NRoleId = client.nickname.ROLEID;

            var GuildInfo, NRole, NTotal;
            GuildInfo = await client.guilds.cache.get(GuildId);
            NRole = await GuildInfo.roles.cache.find(role => role.id == NRoleId);
            NTotal = await NRole.members.map(m => m.user);

            async function sendDM(user) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`\`\`\`Your Nickname has been changed\`\`\`\n**Reason**: Auto-NickName Moderation`)
                client.users.cache.get(user.id).send({
                    embeds: [embed]
                });
            }

            async function sendLog(user) {
                var embed = new EmbedBuilder()
                    .setDescription(`\`\`\`NickName Changed (!)\`\`\`\n<@${user.id}>`)
                logChan = client.channels.cache.get(client.nickname.LOG)
                logChan.send({ embeds: [embed] });
            }

            async function NickNameMod(Role) {

                for (var i = 0; i < Role.length; i++) {
                    const Mention = await client.guilds.cache.get(GuildId).members.cache.get(Role[i].id);

                    const UserNickname = Mention.nickname;

                    if (UserNickname == null) {
                        var namePerms = 0;

                        var userName = Mention.user.username;
                        if (userName.includes("!")) {
                            await Mention.setNickname(userName.replace('!', '')).catch(async (error) => {
                                if (error.code == 50013) {
                                    return namePerms = 1; //Missing Permission
                                }
                            }).then(async () => {
                                if (namePerms == 0) {
                                    await sendDM(Mention);
                                    await sendLog(Mention);

                                } else if (namePerms == 1) {
                                    return;
                                } else {
                                    return;
                                }
                            });
                        }

                    } else {
                        var Perms = 0;

                        if (UserNickname.includes("!")) {
                            await Mention.setNickname(UserNickname.replace('!', '')).catch(async (error) => {
                                if (error.code == 50013) {
                                    return Perms = 1; //Missing Permission
                                }
                                /*return; //Anyother error*/
                            }).then(async () => {
                                if (Perms == 0) {
                                    await sendDM(Mention);
                                    await sendLog(Mention);

                                } else if (Perms == 1) {
                                    return;
                                } else {
                                    return;
                                }
                            });
                        }
                    }
                }
            }

            setInterval(async () => {
                NickNameMod(NTotal);
            }, client.nickname.INTERVAL);
        }
    }
}
