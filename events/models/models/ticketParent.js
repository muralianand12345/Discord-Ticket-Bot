const { Schema, model } = require('mongoose');

const ticketParent = Schema({
    guildID: String,
    mainPar: String,
    oocPar: String,
    combatPar: String,
    suppPar: String,
    bugPar: String,
    charPar: String,
    otherPar: String,
    closedPar: String
});

module.exports = model('ticket-par', ticketParent);