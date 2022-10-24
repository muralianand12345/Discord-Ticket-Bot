const {
    EmbedBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        //if (!interaction.isChatInputCommand()) return;*/

        //Import All Questions

        const que = require('../../questions.json');

        var Title;
        var MinLength, MaxLength;
        var q1, q2, q3, q4;
        var place1, place2, place3, place3;
        var qstyle1, qstyle2, qstyle3, qstyle4;
        var qreq1, qreq2, qreq3, qreq4;

        Title = que.TITLE;

        MinLength = que.MIN_LENGTH;
        MaxLength = que.MAX_LENGTH;

        q1 = que.ONE.QUESTION;
        q2 = que.TWO.QUESTION;
        q3 = que.THREE.QUESTION;
        q4 = que.FOUR.QUESTION;

        place1 = que.ONE.PLACEHOLDER;
        place2 = que.TWO.PLACEHOLDER;
        place3 = que.THREE.PLACEHOLDER;
        place4 = que.FOUR.PLACEHOLDER;

        qreq1 = que.ONE.REQUIRED;
        qreq2 = que.TWO.REQUIRED;
        qreq3 = que.THREE.REQUIRED;
        qreq4 = que.FOUR.REQUIRED;

        qstyle1 = que.ONE.STYLE;
        qstyle2 = que.TWO.STYLE;
        qstyle3 = que.THREE.STYLE;
        qstyle4 = que.FOUR.STYLE;

        if (qstyle1 == "short") {
            qstyle1 = TextInputStyle.Short;
        } else if (qstyle1 == "paragragh") {
            qstyle1 = TextInputStyle.Paragraph
        } else {
            console.log("Some Error 1")
        }

        if (qstyle2 == "short") {
            qstyle2 = TextInputStyle.Short;
        } else if (qstyle2 == "paragragh") {
            qstyle2 = TextInputStyle.Paragraph
        } else {
            console.log("Some Error 2")
        }

        if (qstyle3 == "short") {
            qstyle3 = TextInputStyle.Short;
        } else if (qstyle3 == "paragragh") {
            qstyle3 = TextInputStyle.Paragraph
        } else {
            console.log("Some Error 3")
        }

        if (qstyle4 == "short") {
            qstyle4 = TextInputStyle.Short;
        } else if (qstyle4 == "paragragh") {
            qstyle4 = TextInputStyle.Paragraph
        } else {
            console.log("Some Error 4")
        }

        //interaction Button
        if (interaction.customId == "elitexpr") {

            //Creating modals
            let modal = new ModalBuilder()
                .setCustomId('EliteXQ')
                .setTitle(Title);

            //Questions
            let queOne = new TextInputBuilder()
                .setCustomId('one')
                .setLabel(q1)
                .setRequired(qreq1)
                .setMinLength(MinLength)
                .setMaxLength(MaxLength)
                .setPlaceholder(place1)
                .setStyle(qstyle1);

            let queTwo = new TextInputBuilder()
                .setCustomId('two')
                .setLabel(q2)
                .setRequired(qreq2)
                .setMinLength(MinLength)
                .setMaxLength(MaxLength)
                .setPlaceholder(place2)
                .setStyle(qstyle2);

            let queThree = new TextInputBuilder()
                .setCustomId('three')
                .setLabel(q3)
                .setRequired(qreq3)
                .setMinLength(MinLength)
                .setMaxLength(MaxLength)
                .setPlaceholder(place3)
                .setStyle(qstyle3);

            let queFour = new TextInputBuilder()
                .setCustomId('four')
                .setLabel(q4)
                .setRequired(qreq4)
                .setMinLength(MinLength)
                .setMaxLength(MaxLength)
                .setPlaceholder(place4)
                .setStyle(qstyle4);


            const firstActionRow = new ActionRowBuilder()
                .addComponents(queOne);
            const secondActionRow = new ActionRowBuilder()
                .addComponents(queTwo);
            const thirdActionRow = new ActionRowBuilder()
                .addComponents(queThree);
            const fourthActionRow = new ActionRowBuilder()
                .addComponents(queFour);

            //Adding questions
            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

            //showing modal to user
            await interaction.showModal(modal);

        }

        if (interaction.customId === 'EliteXQ') {
            const UserID = interaction.user.id;

            const rmEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`**Form Submitted By:** <@${UserID}>\n\`\`\`ID: ${UserID}\`\`\``)

            await interaction.reply({ embeds: [rmEmbed] });

            const Ques1 = interaction.fields.getTextInputValue('one');
            const Ques2 = interaction.fields.getTextInputValue('two');
            const Ques3 = interaction.fields.getTextInputValue('three');
            const Ques4 = interaction.fields.getTextInputValue('four');

            const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
            const NickName = interactionUser.nickname;
            const UserName = interactionUser.user.username
            /*var arrUserAns;
            arrUserAns = {
                NickName,
                UserName,
                UserID,
                Answer: { 
                    Ques1, 
                    Ques2, 
                    Ques3, 
                    Ques4 
                }
            }
            console.log(arrUserAns)*/

            const errEmbed = new EmbedBuilder()
                .setTitle("EliteX Exclusive")
                .setColor("Green")
                .setDescription(`\`\`\`User ID: ${UserID}\nServer Name: ${NickName}\nUserName: ${UserName}\`\`\``)
                .addFields(
                    { name: "__Question 1__", value: `**Question:** ${q1}\n**Answer:** ${Ques1}` },
                    { name: "__Question 2__", value: `**Question:** ${q2}\n**Answer:** ${Ques2}` },
                    { name: "__Question 3__", value: `**Question:** ${q3}\n**Answer:** ${Ques3}` },
                    { name: "__Question 4__", value: `**Question:** ${q4}\n**Answer:** ${Ques4}` }
                )
            client.channels.cache.get(client.config.QUESTIONS.ANS_CHAN_ID).send({ embeds: [errEmbed] });
        }
    }
}