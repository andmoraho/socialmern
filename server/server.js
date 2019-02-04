const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const cors = require('cors')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()
//CORS
app.use(cors())

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// DB config
const db = require('./config/keys').mongodbUri

// Connect to DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('DB Connected'))
  .catch(error => console.log(error))
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// PORT
const port = process.env.PORT || 5000

// Passport middleware
app.use(passport.initialize())
// Passport config
require('./config/passport')(passport)

// Use Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  })
}

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
