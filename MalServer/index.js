require('dotenv').config();
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const { connectMongoDb } = require('./utils/MongoConnector');

const app = express()
const mal_auth_router = require('./routes/MalAuthRoutes')
const mal_anime_router = require('./routes/MalAnimeRoutes');

app.use(express.json())
app.use(cookieParser())

const connectDB = async () => {
  try {
    await connectMongoDb()
    console.log(`Database Connected`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB().then(() => {
    app.listen(5000, () => {
    console.log("App listening at port 5000")
})
});

app.use(cors({
    origin: ['http://localhost:5173', 'https://ani-hive-dev.vercel.app'],
     allowedHeaders: ["Content-Type"],
    credentials: true
}))

app.use('/api', mal_auth_router)
app.use('/api/mal', mal_anime_router)

app.get("/", (req,res) => {
    return res.send("Welcome to AniHive Mal Server")
})

