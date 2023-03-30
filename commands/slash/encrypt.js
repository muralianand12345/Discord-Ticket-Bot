const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const CryptoJS = require('crypto-js');

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('encrypt')
        .setDescription("Encrypt and Decrypt a Message")
        .addStringOption((option) => 
            option.setName('action')
            .setDescription('Type')
            .setRequired(true)
            .addChoices(
                {name: 'Encryption', value: 'encrypt'},
                {name: 'Decryption', value: 'decrypt'}
            ))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text Line To Encrypt or Decrypt!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('password')
                .setDescription('Unique Password for Encryption and Decryption')
                .setRequired(false)),
    async execute(interaction, client) {

        const text = interaction.options.getString(`text`);
        const password = interaction.options.getString(`password`) || "123";
        const optionPass = interaction.options.getString(`action`);

        //log
        const commandName = "ENCRYPT";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        function encrypt(text, passphrase) {
            return CryptoJS.AES.encrypt(text, passphrase).toString();
        }
        
        function decrypt(ciphertext, passphrase) {
            const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            return originalText;
        }

        var ReplyEmbed = new EmbedBuilder(); 
        var LogEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .addFields(
            { name: 'Text', value: `${text}`},
            { name: 'Password', value: `${password}`},
            { name: 'Type', value: `${optionPass}`}
        );

        if (optionPass == "encrypt") {
            const finalText = encrypt(text, password);
            LogEmbed.addFields({name: 'FinalText', value: `${finalText}`});
            ReplyEmbed.setColor('#00FF00').setTitle('Encrypt').setDescription(`${finalText}`);
            
        } else if (optionPass == "decrypt") {
            const finalText = decrypt(text, password) || "**Wrong Password or Encryption Text**";
            LogEmbed.addFields({name: 'FinalText', value: `${finalText}`});
            ReplyEmbed.setColor('#FF0000').setTitle('Decrypt').setDescription(`${finalText}`);

        } else {
            ReplyEmbed.setTitle('Error');
        }

        client.channels.cache.get('1090942356796211262').send({ embeds: [LogEmbed] });
        
        await interaction.reply({
            embeds: [ReplyEmbed],
            ephemeral: true
        });
    }
};
