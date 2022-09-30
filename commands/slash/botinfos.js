const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os')
const si = require('systeminformation');

module.exports = {
    cooldown: 10000,
    userPerms: [],
    botPerms: [],

    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('About the Bot <3'),
    async execute(interaction, client) {

        //log
        const commandName = "BOTINFO";
        client.std_log.error(client, commandName, interaction.user.id, interaction.channel.id);

        try {

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("EliteX RP")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.gg/jPSbpsjb4r")
                );

            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;

            let ram = ((process.memoryUsage().heapUsed / 1024 / 1024) + (process.memoryUsage().heapTotal / 1024 / 1024)).toFixed(2);

            const embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setColor("Blue")
                .addFields(
                    {
                        name: 'API latency',
                        value: `\`\`\`${client.ws.ping} ms\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'Users',
                        value: `\`\`\`${client.users.cache.size}\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'Servers',
                        value: `\`\`\`${client.guilds.cache.size}\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'RAM Usage',
                        value: `\`\`\`${ram}MB\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'Server OS',
                        value: `\`\`\`Linux\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'Discord',
                        value: `\`\`\`DiscordJS 14.5.0\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'Developers',
                        value: `\`\`\`Murali Anand & Raghava\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'Uptime',
                        value: `\`\`\`${days}d ${hours}h ${minutes}m ${seconds}s\`\`\``,
                        inline: true,
                    },

                )
                .setTimestamp()
                .setFooter({ text: client.config.footerText, iconURL: client.user.avatarURL() })

            interaction.reply({ embeds: [embed], components: [row] });


        } catch (err) {
            const commandName = "botinfo.js";
            const Line = "Catch Error";
            return client.err_log.error(client, commandName, interaction.user.id, interaction.channel.id, Line, err);
        }

    },
};