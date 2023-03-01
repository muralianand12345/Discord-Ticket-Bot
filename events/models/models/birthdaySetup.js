const { Schema, model } = require('mongoose');

const birthdaySetupSchema = new Schema({
    guildId: { type: String },
    channelId: { type: String },
    roleId: { type: String }
});

module.exports = model('Birthday-Setup', birthdaySetupSchema);