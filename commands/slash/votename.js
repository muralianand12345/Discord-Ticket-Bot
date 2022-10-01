const {
    SlashCommandBuilder 
} = require('discord.js');
const fs = require('fs');

module.exports = {
    cooldown: 10000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('votename')
        .setDescription('Gets The Result of the Current Voting (Only Admins)')
        .addBooleanOption(option =>
            option.setName('updown')
                .setDescription("True = Up || False = Down")
                .setRequired(true)),
    async execute(interaction, client) {

        const votefile = client.config.VOTE.FILE_NAME;

        const readFileLines = filename =>
            fs.readFileSync(filename).toString('UTF8').split('\n');
        let arr = readFileLines(votefile);

        const ChanInfo = interaction.channel.id;
        const chan = client.channels.cache.get(ChanInfo);
        const Optionss = interaction.options.getBoolean('updown');


        if (Optionss == true) {
            arr.forEach(async (Vote) => {
                if (Vote.includes('DOWN')) {
                    var matches = Vote.match(/(\d+)/);
                    chan.send(`Down Voted:   <@${matches[0]}>`)
                }
            });
        } else {
            arr.forEach(async (Vote) => {
                if (Vote.includes('UP')) {
                    var matches = Vote.match(/(\d+)/);
                    chan.send(`Up Voted:   <@${matches[0]}>`)
                }
            });
        }
        await interaction.reply({ content: "Sending", ephemeral: true });
    }
}