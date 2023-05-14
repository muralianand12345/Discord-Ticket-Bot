const fs = require('fs');
const path = require('path');
require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    Partials
} = require('discord.js');
const Errorhandler = require("discord-error-handler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ],
    presence: {
        status: 'idle'
    },
    shards: 'auto', //don't change this unless you know that you are doing
    fetchAllMembers: true
});

const Token = process.env.TOKEN;
const WebhookId = process.env.WEBHOOK_ID;
const WebhookToken = process.env.WEBHOOK_TOKEN;

const handle = new Errorhandler(client, {
    webhook: { id: WebhookId, token: WebhookToken },
    stats: true,
});

const config = require('./config/main/config.json');
const Discord = require('discord.js');
const std_log = require('./logs/std_log.js');

client.discord = Discord;
client.config = config;
client.std_log = std_log;
client.handle = handle;

//extras configurations
const extrasDir = path.join(__dirname, 'config', 'extras');
const extrasFiles = fs.readdirSync(extrasDir);

for (const file of extrasFiles) {
    const property = path.basename(file, '.json');
    client[property] = require(path.join(extrasDir, file));
}
module.exports = client;

//Handler File Read
fs.readdirSync('./handlers').filter((dir) => {
    let files = fs.readdirSync(`./handlers/${dir}`).filter((file) => file.endsWith(".js"));
    for (let file of files) {
        const handler = require(`./handlers/${dir}/${file}`);
        client.on(handler.name, (...args) => handler.execute(...args, client));
    }
});

//events Read
fs.readdirSync('./events').filter((dir) => {
    let files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
    for (let file of files) {
        const event = require(`./events/${dir}/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
    }
});

client.login(Token).catch(err => {
    console.error(`[TOKEN-CRASH] Unable to connect to the BOT's Token`.red);
    console.error(err);
    return process.exit();
});
//Error Handling
process.on('unhandledRejection', async (err, promise) => {
    handle.createrr(client, undefined, undefined, err);
});

process.on('uncaughtException', async (err, origin) => {
    handle.createrr(client, undefined, undefined, err);
});