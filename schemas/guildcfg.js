const { Schema, model } = require('mongoose');
const gSchema = new Schema({
    _id: Schema.Types.ObjectId,
    gid: { type: String, required: true },
    lang: { type: String, required: true },

});

module.exports = model("Guild config", gSchema, "guild configs");