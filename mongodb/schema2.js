const { Schema, model} = require('mongoose');

const details = new Schema({
    guild_id:Number,
    global_ticket_no:Number
})

module.exports = model('Global-Ticket-Number', details);