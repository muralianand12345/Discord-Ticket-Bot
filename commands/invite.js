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
           
        //log
        const commandName = "INVITE";
        client.std_log.error(client,commandName,interaction.user.id,interaction.channel.id);
        
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
            const commandName = "invite.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }
        
    }
};