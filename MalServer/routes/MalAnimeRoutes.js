const express = require('express')
const { me, myAnimeList, updateAnime, checkIsSaved, deleteAnime } = require('../controller/MalAnimeController')
const { sessionMiddleware } = require('../middleware/SessionMiddleware.js')

const router = express.Router()

router.get('/me', sessionMiddleware, me)
router.get('/anime/:status', sessionMiddleware, myAnimeList)
router.get('/anime/check/:id', sessionMiddleware, checkIsSaved)
router.post('/anime', sessionMiddleware, updateAnime)
router.delete('/anime/:id', sessionMiddleware, deleteAnime)

module.exports = router