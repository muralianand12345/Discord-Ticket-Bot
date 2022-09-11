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
        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
           
        //log
        const commandName = "REACTIONROLE";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]});

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
            const errEmbed = new EmbedBuilder()
            .setTitle("ERROR")
            .setColor("Red")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            err_logchan.send({ content: `${errTag}`, embeds: [errEmbed] });
        }  
    },
};