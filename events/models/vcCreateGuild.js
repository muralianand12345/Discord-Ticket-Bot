const { Schema, model } = require('mongoose');

const vcCreateGuild = Schema({
    guildID: String,
    vcID: String,
    parentID: String,
    name: String,
    vcCreateCount: Number,
    logID: String
});

module.exports = model('vccreate-guild', vcCreateGuild);