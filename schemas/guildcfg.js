const { Schema, model } = require('mongoose');
const gSchema = new Schema({
    _id: Schema.Types.ObjectId,
    gid: { type: String, required: true },
    lang: { type: String, required: true },
    members: {
        type: Schema.Types.Mixed,
    },
    commands: {
        type: Schema.Types.Mixed,
    },
    roles: {
        type: Schema.Types.Mixed,
    },
});

module.exports = model("Guild config", gSchema, "guild configs");