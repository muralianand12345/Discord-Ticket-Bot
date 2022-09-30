const fs = require('fs');
require("dotenv").config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  codeBlock
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
    status: 'dnd'
  }
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

//Event File Read
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
};

//Ticket File Read
const ticketFiles = fs.readdirSync('./ticket').filter(file => file.endsWith('.js'));

for (const file of ticketFiles) {
  const event = require(`./ticket/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
};

//slashCommands Read
const slashcommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

for (const file of slashcommandFiles) {
  const command = require(`./commands/slash/${file}`);
  client.commands.set(command.data.name, command);
};

//messageCommands Read
const messagecommandFiles = fs.readdirSync('./commands/message').filter(file => file.endsWith('.js'));

for (const file of messagecommandFiles) {
  const command = require(`./commands/message/${file}`);
  client.commands.set(command.name, command);
};

//Slash Command Register
const slashcommand = fs.readdirSync('./slashcommand').filter(file => file.endsWith('.js'));

for (const file of slashcommand) {
  const event = require(`./slashcommand/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
};

//Streamer File Read
const streamerFiles = fs.readdirSync('./streamer').filter(file => file.endsWith('.js'));

for (const file of streamerFiles) {
  const event = require(`./streamer/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
};

client.login(Token).catch(err => {
  console.error(`[TOKEN-CRASH] Unable to connect to the BOT's Token`.red);
  console.error(err);
  return process.exit();
});

//Anti Crash
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});