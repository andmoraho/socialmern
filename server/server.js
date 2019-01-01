const express = require('express')
const mongoose = require('mongoose')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

// DB config
const db = require('./config/keys').mongodbUri

// Connect to DB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('DB Connected'))
  .catch(error => console.log(error))

// PORT
const port = process.env.PORT || 5000

// Use Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

app.get('/', (req, res) => {
  res.send('Hello Andres')
})

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
