const { Schema, model } = require('mongoose');

const guild = Schema({
    guildID: String,
    ticketCount: Number
});

module.exports = model('guild-count', guild);