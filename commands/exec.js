const { 
    SlashCommandBuilder,
    EmbedBuilder 
} = require('discord.js');
const exec = require("child_process").exec;
const { codeBlock } = require("@discordjs/builders");

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exec')
        .setDescription("Owner Only Command")
        .addStringOption(option =>
            option.setName('text')
            .setDescription('command')
            .setRequired(true)),
    async execute(interaction, client) {

        const text = interaction.options.getString('text');

       //Err
       const errTag = client.config.ERR_LOG.ERR_TAG;
       const err_chanid = client.config.ERR_LOG.CHAN_ID
       const err_logchan = client.channels.cache.get(err_chanid);     
           
       //log
       const commandName = "EXEC";
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

                const owner_ID = client.config.INFO.OWNER_ID;
                const coowner_ID = client.config.INFO.COOWNER_ID;

                if (interaction.user.id === owner_ID || coowner_ID) {
                    const chan = interaction.channel.id; 
                    const consoleChan = client.config.INFO.CONSOLE.CHAN_ID;

                    if ( chan === consoleChan) {

                        exec(text, async (err, res) =>{
                            if(err) {
                              return await interaction.reply(`Ran: ${text}\n${codeBlock("bash", err)}`).catch(e => client.channels.cache.get(chan).send(`ERROR \n${err}`));
                            }
                            await interaction.reply(`Ran: ${text}\n${codeBlock("bash", res.slice(0, 2000))}`).catch(e => client.channels.cache.get(chan).send("ERROR"));
                        });
                    } else {
                        const ReplyEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription('Invalid Channel!')

                        return interaction.reply({
                            embeds: [ReplyEmbed],
                            ephemeral: true
                        });
                    }
 
                    cooldown.add(interaction.user.id);
                    setTimeout(() => {
                        cooldown.delete(interaction.user.id);
                    }, cooldownTime);  
                } else {
                    return interaction.reply({content: "This is a Owner Only Command!",ephemeral: true});
                }
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