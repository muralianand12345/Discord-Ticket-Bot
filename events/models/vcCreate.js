const { Schema, model } = require('mongoose');

const vcCreate = Schema({
    guildID: String,
    vcID: String,
    userID: String
});

module.exports = model('guild-vccreate', vcCreate);