const { Schema, model } = require('mongoose');

const ticket = Schema({
    guildID: String,
    userID: String,
    ticketID: String,
    ticketStatus: Boolean,
    msgID: String,
    msgPannelID: String
});

module.exports = model('ticket-main', ticket);

