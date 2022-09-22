const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    PermissionsBitField 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a person.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to ban')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for ban')
            .setRequired(false)),

    async execute(interaction, client) {

        //log
        const commandName = "BAN";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (!executer.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription('You do not have the required permission to execute this command! (`BAN_MEMBERS`)')

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription('The person you want to ban has higher privilege than you!')

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        if (!user.bannable) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`The person you want to ban has higher privilege So I can't ban.`)

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

        try{
            if (interaction.options.getString('reason')) {
                user.ban({
                    reason: interaction.options.getString('reason'),
                    days: 1
                });
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`**${user.user.tag}** Has been successfully banned!`)
                .addFields(
                    { name: "Reason", value: `${interaction.options.getString('reason')}`}
                )

                interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });

            } else {
                user.ban({
                    days: 1
                });
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`**${user.user.tag}** Has been successfully banned!`)

                interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            };

        } catch(err) {
            const commandName = "ban.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }        
    },
};