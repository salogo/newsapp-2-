
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const session = require('express-session')
const path = require('path')
const checkAuthorization = require('./utils/authorization')

const userRoutes = require('./routes/users')
const indexRoutes = require('./routes/index')

const PORT = process.env.PORT || 8080
const CONNECTION_STRING = "postgres://cdzieasdzhwgaa:854b0a8c0d5581173965d56121f060dd78e87dacc5302c1766b6e693d52a4187@ec2-34-194-198-176.compute-1.amazonaws.com:5432/d6r1lk929tnkbc"

const VIEWS_PATH = path.join(__dirname,'/views')

// configuring your view engine
app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials','.mustache'))
app.set('views',VIEWS_PATH)
app.set('view engine','mustache')

app.use('/css',express.static('css')) // localhost:3000/css/site.css

app.use(session({
  secret: 'lhadhlsdalh',
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.urlencoded({extended: false}))

app.use((req,res,next) => {
  res.locals.authenticated = req.session.user == null ? false : true
  next() 
})

db = pgp(CONNECTION_STRING)

// setup routes
app.use('/',indexRoutes)
app.use('/users',checkAuthorization,userRoutes)


app.listen(PORT,() => {
  console.log(`Server has started on ${PORT}`)
})
