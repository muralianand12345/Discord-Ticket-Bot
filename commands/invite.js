const { 
    SlashCommandBuilder,
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle  
} = require("discord.js");

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Sends EliteX RP Server Invite Link"),
    async execute(interaction, client) {
        
        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
           
        //log
        const commandName = "INVITE";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]}); 
        
        try {
            if (cooldown.has(interaction.user.id)) {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Try Again Later (Cooldown)')

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
                
            } else {
                const row = new ActionRowBuilder()
			    .addComponents(
                new ButtonBuilder()
                .setLabel("EliteX RP")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/jPSbpsjb4r")
			    );
                const mainPage = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setColor('#303236')
                .addFields({ name:'**Join ELiteX RP**', value:`[Here](https://discord.gg/jPSbpsjb4r)`})
             
                interaction.reply({embeds: [mainPage], components: [row]})

                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);

            }
            
        } catch(err) {
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
        
    }
};