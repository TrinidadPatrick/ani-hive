const express = require('express')
const { me, myAnimeList } = require('../controller/MalAnimeController')

const router = express.Router()

router.get('/me', me)
router.get('/anime/:status', myAnimeList)

module.exports = router