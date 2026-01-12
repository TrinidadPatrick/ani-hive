const mongoose = require('mongoose')

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

module.exports.connectMongoDb = async () => {

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log("New MongoDB Connection Established");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        console.log(error)
        cached.promise = null;
        console.error("MongoDB Connection Error:", e);
        throw e;
    }

    return cached.conn
}