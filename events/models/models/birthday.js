const { Schema, model } = require('mongoose');

const userBirthdaySchema = new Schema({
    userId: { type: String, required: true },
    birthday: { type: Date, timezone: true },
    timezone: { type: String, required: true }
});

module.exports = model('User-Birthday', userBirthdaySchema);