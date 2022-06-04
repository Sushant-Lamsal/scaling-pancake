//making const because its value should'nt be changed 
// const express = require('express')
// const app = express()
// //require to load router.js file into main app
// const router= require('./router')

// //method in express to recognize the incoming request object as strings or arrays
// app.use(express.urlencoded({extended:false}))

// app.use(express.json())

// //making public folder accessible and express.static is a method
// app.use(express.static('public'))

// //views is a config option and another viewes is a folder
// app.set('views', 'views')


// //let express know which template system we are using and ejs is the template engine
// app.set('view engine', 'ejs')


// //tell express application to use that router
// app.use('/', router)


// module.exports = app

const express = require('express')
const session = require('express-session')
const app = express()
let sessionOptions = session({
    secret: 'JavaScript is soooooo cool',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 , httpOnly: true
    }
})
app.use(sessionOptions)
const router = require('./router')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app