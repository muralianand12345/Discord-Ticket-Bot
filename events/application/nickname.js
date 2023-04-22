const {
    EmbedBuilder,
    Events
} = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {

        const roleId = client.nickname.ROLEID;
        const guildId = client.nickname.GUILDID;
        const options = [

            "!",
            "\"",
            "#",
            "$",
            "%",
            "&",
            "`",
            "'",
            "(",
            ")",
            "*",
            "+",
            ",",
            "-",
            ".",
            "/",
            ":",
            ";",
            "<",
            "=",
            ">",
            "?",
            "@",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "[",
            "]",
            "_"
        ];


        if (client.config.ENABLE.NICKNAME == true) {
            setInterval(() => {
                checkNicknames();
            }, client.nickname.INTERVAL);
        }

        //function

        function checkFirstLetterIsOption(str) {
            const firstLetter = str.charAt(0);
            if (options.includes(firstLetter)) {
                return true;
            }
            return false;
        }

        async function logEmbedFunc(userId, memberInfo, nickName) {
            const logEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`**Nickname Changed!** <@${userId}>`)
                .addFields(
                    { name: 'User Name', value: `${memberInfo.user.username}#${memberInfo.user.discriminator}` },
                    { name: 'Nickname', value: `${nickName}` },
                );
            logChan = client.channels.cache.get(client.nickname.LOG).send({ embeds: [logEmbed] });
        }

        async function checkNicknames() {

            const guild = client.guilds.cache.find(guild => guild.id === guildId);
            if (!guild) return;

            const roles = roleId.map(roleId => guild.roles.cache.find(role => role.id === roleId));
            if (roles.some(role => !role)) return;

            for (const [memberId, member] of guild.members.cache) {
                if (member.roles.cache.some(role => roles.includes(role))) {
                    if (!member.nickname && member.user.username[0] && checkFirstLetterIsOption(member.user.username[0])) {
                        const newNickname = member.user.username.slice(1);
                        await member.setNickname(newNickname);
                        await logEmbedFunc(memberId, member, newNickname);
                    }

                    if (member.displayName && checkFirstLetterIsOption(member.displayName[0])) {

                        const newNickname = member.displayName.slice(1);
                        await member.setNickname(newNickname);
                        await logEmbedFunc(memberId, member, newNickname);
                    }
                }
            }
        }
    }
}
