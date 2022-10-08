const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],
    
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Sends reaction role message')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) { 
        const Role = client.config.REDM_CHAN.ROLE;
        const Emoji = client.config.REDM_CHAN.EMOJI;
           
        //log
        const commandName = "REACTIONROLE";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        function sendMsg() {
            const reactionRole = client.channels.cache.get(client.config.REDM_CHAN.CHAN_ID);
            const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription('```REDM ROLE```')

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('role1')
                .setLabel(Role)
                .setEmoji(Emoji)
                .setStyle(ButtonStyle.Secondary),
            );
            reactionRole.send({ embeds: [embed], components: [button] });
        }

        try{
            sendMsg();

            const ReplyEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("Reaction Has Been Sent Successfully!")
            interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            }).catch(err => {throw err});  
            
        } catch(err){
            const commandName = "reactionrole.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }  
    },
};