const {
    EmbedBuilder,
    SlashCommandBuilder
} = require('discord.js');
const fs = require('fs')

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('voteresult')
        .setDescription('Gets The Result of the Current Voting (Only Admins)')
        .addBooleanOption(option =>
            option.setName('delete')
                .setDescription("Want to delete previous vote? True = delete || False = do not delete")
                .setRequired(true)),

    async execute(interaction, client) {

        //log
        const commandName = "VOTERESULT";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        async function ReadFileArray(votefile) {
            const readFileLines = filename =>
                fs.readFileSync(filename).toString('UTF8').split('\n');
            let arr = readFileLines(votefile);

            //Total Votes
            let Total = arr.length - 1;

            // 👍 Total Number
            let TotalUP = 0;
            await arr.forEach(async (Vote) => {
                if (Vote.includes('UP')) {
                    TotalUP = TotalUP + 1;
                }
                return TotalUP;
            });

            // 👎 Total Number
            let TotalDOWN = 0;
            await arr.forEach(async (Vote) => {
                if (Vote.includes('DOWN')) {
                    TotalDOWN = TotalDOWN + 1;
                }
                return TotalDOWN;
            });

            //Percentage Mathematics
            const PercentageUP = Math.round(TotalUP * 100 / Total);
            const PercentageDOWN = Math.round(TotalDOWN * 100 / Total);

            //EMBED
            const ResultEmbed = new EmbedBuilder()
                .setDescription("VOTE RESULT")
                .setColor("#E6E6FA")
                .addFields(
                    { name: "👍", value: `\`Total: ${TotalUP}\nPercentage: ${PercentageUP}%\`` },
                    { name: "👎", value: `\`Total: ${TotalDOWN}\nPercentage: ${PercentageDOWN}%\`` }
                )
            await interaction.reply({ embeds: [ResultEmbed], ephemeral: true });
        }

        try {
            const FileName = client.config.VOTE.FILE_NAME;
            ReadFileArray(FileName);
            const DeleteOp = interaction.options.getBoolean('delete');
            const ChannelID = interaction.channel.id;
            if (DeleteOp == true) {
                fs.writeFile(FileName, '', function () {
                    client.channels.cache.get(ChannelID).send({ content: "**Vote Deleted**\nStart a new voting!" });
                });
            } else if (DeleteOp == false) {

            } else {
                const commandName = "id.js";
                const err = "**ERROR!**";
                const Line = "Unable to Delete";
                return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
            }

        } catch (err) {
            const commandName = "voteresult.js";
            const Line = "Catch Error";
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }


    },
};