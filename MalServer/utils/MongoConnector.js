const mongoose = require('mongoose')

module.exports.connectMongoDb = async () => {
    try {
        const result = await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(error)
    }
}