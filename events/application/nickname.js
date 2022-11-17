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

            async function NickNameMod(Role) {

                for (var i = 0; i < Role.length; i++) {
                    const Mention = await client.guilds.cache.get(GuildId).members.cache.get(Role[i].id);

                    const UserNickname = Mention.nickname;

                    if (UserNickname == null) {

                    } else {
                        if (UserNickname.includes("!")) {
                            await Mention.setNickname(UserNickname.replace('!', '')).catch(async (error) => {
                                if (error.code == 50013) {
                                    return; //Missing Permission
                                }
                                /*return; //Anyother error*/
                            });

                            var embed = new EmbedBuilder()
                                .setDescription(`\`\`\`NickName Changed (!)\`\`\`\n<@${Mention.id}>`)
                            logChan = client.channels.cache.get(client.nickname.LOG)
                            logChan.send({ embeds: [embed] });
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
