const RoleID = require("../config.json").VOTE.ROLE_ID;
const { EmbedBuilder,SlashCommandBuilder } = require('discord.js');
const fs  = require('fs')

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voteresult')
        .setDescription('Gets The Result of the Current Voting (Only Admins)')
        .addBooleanOption(option =>
            option.setName('delete')
            .setDescription("Want to delete previous vote? True = delete || False = do not delete")
            .setRequired(true)),
    async execute(interaction, client) {

        //Err
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const err_chanid = client.config.ERR_LOG.CHAN_ID
        const err_logchan = client.channels.cache.get(err_chanid);     
           
        //log
        const commandName = "VOTERESULT";
        const logEmbed = new EmbedBuilder()
        .setColor("Green")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        err_logchan.send({ embeds: [logEmbed]});

        async function ReadFileArray(votefile) {
            const readFileLines = filename => 
            fs.readFileSync(filename).toString('UTF8').split('\n');
            let arr = readFileLines(votefile);

            //Total Votes
            let Total = arr.length - 1;
            
            // 👍 Total Number
            let TotalUP = 0;
            await arr.forEach(async(Vote) => {
                if (Vote.includes('UP')) {
                    TotalUP = TotalUP + 1;
                }
                return TotalUP;
            });

            // 👎 Total Number
            let TotalDOWN = 0;
            await arr.forEach(async(Vote) => {
                if (Vote.includes('DOWN')) {
                    TotalDOWN = TotalDOWN + 1;
                }
                return TotalDOWN;
            });

            //Percentage Mathematics
            const PercentageUP = Math.round(TotalUP * 100/Total);
            const PercentageDOWN = Math.round(TotalDOWN * 100/Total);

            //EMBED
            const ResultEmbed = new EmbedBuilder()
            .setDescription("VOTE RESULT")
            .setColor("#E6E6FA")
            .addFields(
                { name: "👍", value: `\`Total: ${TotalUP}\nPercentage: ${PercentageUP}%\``},
                { name: "👎", value: `\`Total: ${TotalDOWN}\nPercentage: ${PercentageDOWN}%\``}
            )
            await interaction.reply({ embeds: [ResultEmbed], ephemeral: true });
        }
        
        try{
            const User = interaction.member;
            if (cooldown.has(interaction.user.id)) {
                const ReplyEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription('Try Again Later (Cooldown)')

                return interaction.reply({
                    embeds: [ReplyEmbed],
                    ephemeral: true
                });

            } else {
                if (User.roles.cache?.has(`${RoleID}`)) {
                    const FileName = client.config.VOTE.FILE_NAME;
                    ReadFileArray(FileName);   
                    const DeleteOp = interaction.options.getBoolean('delete');
                    const ChannelID = interaction.channel.id;
                    if (DeleteOp == true) {
                        fs.writeFile(FileName, '', function(){
                            client.channels.cache.get(ChannelID).send({ content: "**Vote Deleted**\nStart a new voting!"});
                        });
                    } else if (DeleteOp == false) {
                        
                    } else {
                        err_logchan.send({ content: `File: voteresult.js\nUnable to Delete | **ERROR!**`});
                    }

                } else {
                    const ReplyEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("This command is for admins only!")

                    return await interaction.reply({
                        embeds: [ReplyEmbed],
                        ephemeral: true
                    });
                }
                cooldown.add(interaction.user.id);
                setTimeout(() => {
                   cooldown.delete(interaction.user.id);
                }, cooldownTime);  
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