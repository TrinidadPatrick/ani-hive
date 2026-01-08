const mongoose = require('mongoose')

const {Schema} = mongoose

const userRefreshSchema = new Schema({
    user_id: {type: String, required: true},
    refresh_token: {type: String, required: true},
    
},{ timestamps: true })

module.exports.UserRefreshToken = mongoose.model('user_refresh_token', userRefreshSchema)