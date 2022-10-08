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
        try{
            //if (!interaction.isChatInputCommand()) return;*/

            //Import All Questions

            const que = require('../../cars.json');

            var Title;
            var MinLength, MaxLength;
            var q1, q2, q3;
            var place1, place2, place3, place3;
            var qstyle1, qstyle2, qstyle3;
            var qreq1, qreq2, qreq3;

            Title = que.TITLE;

            MinLength = que.MIN_LENGTH;
            MaxLength = que.MAX_LENGTH;

            q1 = que.ONE.QUESTION;
            q2 = que.TWO.QUESTION;
            q3 = que.THREE.QUESTION;

            place1 = que.ONE.PLACEHOLDER;
            place2 = que.TWO.PLACEHOLDER;
            place3 = que.THREE.PLACEHOLDER;

            qreq1 = que.ONE.REQUIRED;
            qreq2 = que.TWO.REQUIRED;
            qreq3 = que.THREE.REQUIRED;

            qstyle1 = que.ONE.STYLE;
            qstyle2 = que.TWO.STYLE;
            qstyle3 = que.THREE.STYLE;        

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

            //interaction Button
            if (interaction.customId == "carorder") {

                //Creating modals
                let modal = new ModalBuilder()
                .setCustomId('Carmodal')
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

                const firstActionRow = new ActionRowBuilder()
                .addComponents(queOne);
		        const secondActionRow = new ActionRowBuilder()
                .addComponents(queTwo);
                const thirdActionRow = new ActionRowBuilder()
                .addComponents(queThree);

                //Adding questions
                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

                //showing modal to user
                await interaction.showModal(modal);

            }

            if (interaction.customId === 'Carmodal') {
                const UserID = interaction.user.id;

                const rmEmbed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`**Form Submitted By:** <@${UserID}>\n\`\`\`ID: ${UserID}\`\`\``)

                await interaction.reply({ embeds: [rmEmbed], ephemeral: true });

                const Ques1 = interaction.fields.getTextInputValue('one');
                const Ques2 = interaction.fields.getTextInputValue('two');
                const Ques3 = interaction.fields.getTextInputValue('three');

                const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
                const NickName = interactionUser.nickname;
                const UserName = interactionUser.user.username
                
                const errEmbed = new EmbedBuilder()
                .setTitle("EliteX Exclusive")
                .setColor("Green")
                .setDescription(`\`\`\`Server Name: ${NickName}\nUserName: ${UserName}\`\`\``)
                .addFields(
                    { name: "`------------`", value: `**${q1}**\n${Ques1}`},
                    { name: "`------------`", value: `**${q2}**\n${Ques2}`},
                    { name: "`------------`", value: `**${q3}**\n${Ques3}`}
                )
                client.channels.cache.get(client.config.CAR.REPLY_CHAN).send({ embeds: [errEmbed] });
                
            }

        } catch(err) {
            const commandName = "interactionQuestions.js";
            const Line = "Catch Error";
            return client.err_log.error(client,commandName,interaction.user.id,interaction.channel.id,Line,err);
        }
    }
}