const express = require('express')
const { me, myAnimeList, updateAnime } = require('../controller/MalAnimeController')
const { sessionMiddleware } = require('../middleware/SessionMiddleware.js')

const router = express.Router()

router.get('/me', sessionMiddleware, me)
router.get('/anime/:status', sessionMiddleware, myAnimeList)
router.post('/anime', sessionMiddleware, updateAnime)

module.exports = router