const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle 
} = require('discord.js');

const config = require('../config.json');
const Role = config.REDM_CHAN.ROLE;
const Emoji = config.REDM_CHAN.EMOJI;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Sends reaction role message'),
    async execute(interaction, client) { 
           
        //log
        const commandName = "REACTIONROLE";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);

        const owner_ID = client.config.INFO.OWNER_ID;
        if (interaction.user.id !== owner_ID ) {
            const ReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("This command is only for developers")

            return interaction.reply({
                embeds: [ReplyEmbed],
                ephemeral: true
            });
        }

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