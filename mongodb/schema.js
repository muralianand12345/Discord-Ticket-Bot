const { Schema, model} = require('mongoose');

const details = new Schema({
    guild_id: String,
    user_id: String,
    ticket_channel_id: String,
    user_ticket_id: Number,
    server_ticket_id: Number,
    ticket_status: String,
})

module.exports = model('Ticket-Details', details);