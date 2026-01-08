require('dotenv').config();
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
const mal_auth_router = require('./routes/MalAuthRoutes')
const mal_anime_router = require('./routes/MalAnimeRoutes')

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ['http://localhost:5173'],
     allowedHeaders: ["Content-Type"],
    credentials: true
}))

app.use('/api', mal_auth_router)
app.use('/api/mal', mal_anime_router)

app.get("/", (req,res) => {
    return res.send("Welcome to AniHive Mal Server")
})

app.listen(5000, () => {
    console.log("App listening at port 5000")
})