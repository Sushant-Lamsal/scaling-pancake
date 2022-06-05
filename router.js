//module.exports tells node js which bits of code to export from a given file so other files are allowed to access the exported code
//router is just a route that routes to a specific file

const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

//user related routes
router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//post related routes
router.get('/create-post',userController.mustBeLoggedIn, postController.viewCreateScreen)

module.exports = router