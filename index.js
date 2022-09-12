const fs = require('fs');
require("dotenv").config();
const mongo=require('./mongodb/mongoose.js')
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,  
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.GuildMessageTyping, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction
    ] 
});
new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildEmojisAndStickers, 
        GatewayIntentBits.GuildIntegrations, 
        GatewayIntentBits.GuildWebhooks, 
        GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
client.commands = new Collection();
const Token = process.env.TOKEN;

const config = require('./config.json');
const Discord = require('discord.js');
client.discord = Discord;
client.config = config;

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

//Commands Read
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
};

//Slash Command Register
const slashcommand = fs.readdirSync('./slashcommand').filter(file => file.endsWith('.js'));

for (const file of slashcommand) {
    const event = require(`./slashcommand/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};
mongo.login();
client.login(Token); 