const {
    EmbedBuilder,
    Events
} = require('discord.js')

module.exports = {
    name: Events.MessageCreate,
    execute: async (message, client) => {
        ///roles
        const role1 = client.automod.TAG.ROLE1;
        const role2 = client.automod.TAG.ROLE2;
        const role3 = client.automod.TAG.ROLE3;
        const role4 = client.automod.TAG.ROLE4;
        //guild
        const GuildID = client.automod.GUILD;
        //channels
        const chan1 = client.automod.TAG.CHAN1;
        const chan2 = client.automod.TAG.CHAN2;
        const chan3 = client.automod.TAG.CHAN3;
        
        if (message.guild == null) {
            return;
        }

        if (message.guild.id == GuildID) {
            const User = message.member;
            const ChanID = message.channel.id;

            if (message.author.bot) return;

            //roles
            if (User.roles.cache?.has(role1) || User.roles.cache?.has(role2) || User.roles.cache?.has(role3) || User.roles.cache?.has(role4)) return;
            //channels
            if (ChanID == chan1 || ChanID == chan2 || ChanID == chan3) return;

            if (message.content.includes('@everyone') || message.content.includes('@here')) {
                message.delete();
                return message.channel.send({ content: "**Auto-Mod | Reason: Tagging Everyone**" })
                    .then((msg) => {
                        setTimeout(function () {
                            msg.delete()
                        }, 4000);
                    });
            }
        }
    }
}
