//module.exports tells node js which bits of code to export from a given file so other files are allowed to access the exported code
//router is just a route that routes to a specific file

const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')

router.get('/', userController.home)
router.post('/register', userController.register)

router.post('/login', userController.login)
router.post('/logout', userController.logout)

module.exports = router