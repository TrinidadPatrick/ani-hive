const express = require('express')
const { token, logout } = require('../controller/MalAuthController')

const router = express.Router()

router.post('/auth/mal/token', token)
router.post('/auth/mal/logout', logout)

module.exports = router