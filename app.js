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
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const markdown = require('marked')
const csrf = require('csurf')
const app = express()
const sanitizeHTML = require('sanitize-html')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/api', require('./router-api'))

let sessionOptions = session({
    secret: "JavaScript is sooooooooo coool",
    store: MongoStore.create({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())

app.use(function(req, res, next) {
  // make our markdown function available from within ejs templates
    res.locals.filterUserHTML = function(content) {
    return sanitizeHTML(markdown.parse(content), {allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], allowedAttributes: {}})
    }

  // make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")

  // make current user id available on the req object
    if (req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}

  // make user session data available from within view templates
    res.locals.user = req.session.user
    next()
})

const router = require('./router')

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(csrf())

app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/', router)

app.use(function(err, req, res, next) {
    if (err) {
    if (err.code == "EBADCSRFTOKEN") {
        req.flash('errors', "Cross site request forgery detected.")
        req.session.save(() => res.redirect('/'))
    } else {
        res.render("404")
    }
    }
})

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.use(function(socket, next) {
    sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', function(socket) {
    if (socket.request.session.user) {
    let user = socket.request.session.user

    socket.emit('welcome', {username: user.username, avatar: user.avatar})

    socket.on('chatMessageFromBrowser', function(data) {
    socket.broadcast.emit('chatMessageFromServer', {message: sanitizeHTML(data.message, {allowedTags: [], allowedAttributes: {}}), username: user.username, avatar: user.avatar})
    })
}
})

module.exports = server