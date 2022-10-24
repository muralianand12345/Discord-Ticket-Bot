const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    cooldown: 2000,
    userPerms: ['Administrator'],
    botPerms: ['Administrator'],

    data: new SlashCommandBuilder()
        .setName('supporters')
        .setDescription("Sends Supporter Pack Message(Admin)")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Pack')
                .setRequired(true)
                .addChoices(
                    { name: '5 Coins', value: '5' },
                    { name: '11 Coins', value: '10' },
                    { name: '17 Coins', value: '15' },
                    { name: '23 Coins', value: '20' },
                    { name: '34 Coins', value: '30' },
                    { name: '45 Coins', value: '40' },
                    { name: '56 Coins', value: '50' },
                    { name: '70 Coins', value: '60' },
                ))
        .addChannelOption(
            option =>
                option.setName('channelid')
                    .setDescription('Channel you want to send!')
                    .setRequired(false)
        ),

    async execute(interaction, client) {

        let supchannel;
        if (interaction.options.getChannel('channelid') == null) {
            supchannel = client.config.SUP_PACK.CHAN_ID;
        } else {
            supchannel = interaction.options.getChannel('channelid').id
        }

        const category = interaction.options.getString(`category`) || null;

        //log
        const commandName = "SUPPORTERS";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        //options (slash)
        var Color;
        var link;
        var discrip;
        if (category == "5") {
            discrip = "5 Elitex Coins Only"
            Color = "Aqua"
            link = "https://pmny.in/9ICmfPiLimik";
        } else if (category == "10") {
            discrip = "10 Elitex Coins + 1 Bonus Elitex Coins "
            Color = "DarkAqua"
            link = "https://pmny.in/0IhYJykvfW1M";
        } else if (category == "15") {
            discrip = "15 Elitex Coins + 2 Bonus Elitex Coins + 1 Bike from Current Month Premium Pack"
            Color = "Green"
            link = "https://pmny.in/FIJWU6MH6Z4t";
        } else if (category == "20") {
            discrip = "20 Elitex Coins + 3 Bonus Elitex Coins + 1 Vehicle from Current Month Premium Pack + House"
            Color = "DarkGreen"
            link = "https://pmny.in/PIHWy62HFuNi";
        } else if (category == "30") {
            discrip = "30 Elitex Coins + 4 Bonus Elitex Coins + 2 Vehicles from Current Month Premium Pack + House + Private Garage at your requested location* "
            Color = "Blue"
            link = "https://pmny.in/uIbY7y9thzVV";
        } else if (category == "40") {
            discrip = "40 Elitex Coins + 5 Bonus Elitex Coins + 3 Vehicles from Current Month Premium Pack + House with 2 garage slot + Private Garage at your requested location*"
            Color = "DarkBlue"
            link = "https://pmny.in/ErQFmd7BCO2H";
        } else if (category == "50") {
            discrip = "50 Elitex Coins + 6 Bonus Elitex Coins + 4 Vehicles from Current Month Premium Pack + House with 6 garage slot + Private Garage at your requested location*"
            Color = "Purple"
            link = "https://pmny.in/6rPovC8kRZ95";
        } else if (category == "60") {
            discrip = "60 Elitex Coins + 10 Bonus Elitex Coins + All Vehicles from Current Month Premium Pack + House with 10 Garage Slot  + Private Garage at your requested location*"
            Color = "DarkPurple"
            link = "https://pmny.in/ErXeMTqZmmXH";
        } else {
            console.log("Error!");
        }

        //embed function
        async function sendSupMsg() {
            const supChan = client.channels.cache.get(supchannel);
            const supEmbed = new EmbedBuilder()
                .setColor(Color)
                .setTitle("EliteX Coins")
                .setDescription(`\`\`\`${discrip}\`\`\``)
                .setFooter({ text: client.config.SUP_PACK.FOOTER, iconURL: client.user.avatarURL() })

            const supButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`${category} Coins`)
                        .setEmoji('🪙')
                        .setStyle(ButtonStyle.Link)
                        .setURL(link)
                )

            supChan.send({
                embeds: [supEmbed],
                components: [supButton],
            });
        }

        const ReplyEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("Supporter Pack Message Has Been Sent!")
        interaction.reply({
            embeds: [ReplyEmbed],
            ephemeral: true
        }).then(() => {
            sendSupMsg();
        });
    }
};