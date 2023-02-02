const {
    EmbedBuilder,
    Events
} = require('discord.js');

module.exports = {
    name: Events.MessageDelete,
    async execute(message, client) {

        if (message.author == null) return;
        if (message.author.bot) return;

        const logEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`A [**Message**](${message.url}) by ${message.author.tag} was **Deleted**.\n
            **Deleted Message**:\n ${message.content ? message.content : "None"}`.slice("0", "4096"))
            .addFields(
                { name: "Guild Name", value: message.guild.name || "Unknown" }
            )
            .setTimestamp();

        client.channels.cache.get(client.glog.MESSAGE.DELETE).send({
            embeds: [logEmbed]
        });
    }
}