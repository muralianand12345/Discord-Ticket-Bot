const { Schema, model } = require('mongoose');

const votingSchema = new Schema({
    messageId: { type: String, required: true },
    guildId: { type: String, required: true },
    voteType: { type: String, enum: ['multi', 'once'], required: true },
    time: { type: Date, default: Date.now },
    votes: [{
        userId: { type: String, required: true },
        buttonId: { type: String, required: true },
    }],
});

module.exports = model('Vote', votingSchema);