const fs = require('fs');
require("dotenv").config();
const {
  Client,
  Collection,
  GatewayIntentBits,
} = require('discord.js');

const colors = require("colors");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  presence: {
    status: 'idle'
  },
  shards: 'auto'
});

client.commands = new Collection();
const Token = process.env.TOKEN;

const config = require('./config.json');
const Discord = require('discord.js');
const err_log = require('./logs/err_log.js');
const std_log = require('./logs/std_log.js');

client.discord = Discord;
client.config = config;
client.err_log = err_log;
client.std_log = std_log;
module.exports = client;

//events Read
fs.readdirSync('./events').filter((dir) => {
  let files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
  for (let file of files) {
      const event = require(`./events/${dir}/${file}`);
      client.on(event.name, (...args) => event.execute(...args, client));
  }
});

//Handler File Read
fs.readdirSync('./handlers').filter((dir) => {
  let files = fs.readdirSync(`./handlers/${dir}`).filter((file) => file.endsWith(".js"));
  for (let file of files) {
    const handler = require(`./handlers/${dir}/${file}`);
    client.on(handler.name, (...args) => handler.execute(...args, client));
  }
});

client.login(Token).catch(err => {
  console.error(`[TOKEN-CRASH] Unable to connect to the BOT's Token`.red);
  console.error(err);
  return process.exit();
});

//Error Handling
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});

process.on('uncaughtException', async (err, origin) => {
  console.error(`[ANTI-CRASH] Unhandled Exception: ${err}`.red);
  console.error(origin);
});