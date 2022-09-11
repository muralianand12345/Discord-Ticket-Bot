const RoleID = require("../config.json").VOTE.ROLE_ID;
const {SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder,
    ButtonStyle  
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Custom voting (Only Admins)')
        .addStringOption(option =>
            option.setName('text')
            .setDescription('Your vote poll message here')
            .setRequired(true)),
    async execute(interaction, client) {

        const text = interaction.options.getString('text');

        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
           
        //log
        const commandName = "VOTE";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]});

        function sendMsg() {
            const votechan = client.channels.cache.get(client.config.VOTE.CHAN_ID);
            const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`\`\`\`${text}\`\`\``)

            const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('vote1')
                .setEmoji("👍")
                .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                .setCustomId('vote2')
                .setEmoji("👎")
                .setStyle(ButtonStyle.Danger),
            );
            votechan.send({ embeds: [embed], components: [button] }).then( async(message) => {
                await message.pin();
                await interaction.channel.bulkDelete(1);
            }).catch(err => console.log(err));
        }

        try{
            const User = interaction.member;
            if (User.roles.cache?.has(`${RoleID}`)) {
                sendMsg();
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("`Vote Sent Successfully!`")

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            } else {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("This command is for admins only!")

                return await interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });
            }
            
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