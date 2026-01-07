const express = require('express')
const { token } = require('../controller/MalAuthController')
const { me } = require('../controller/MalAnimeController')

const router = express.Router()

router.post('/auth/mal/token', token)

module.exports = router