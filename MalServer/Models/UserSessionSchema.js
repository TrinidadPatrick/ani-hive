const mongoose = require('mongoose')

const {Schema} = mongoose

const sessionSchema = new Schema({
    session_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true }, // who this session belongs to
    access_token: {type: String, required: true},
    expires_at: { type: Date, required: true },
    access_token_expires_at: { type: Date, required: true },
  }, { timestamps: true });
  
  module.exports.Session = mongoose.model('Session', sessionSchema);