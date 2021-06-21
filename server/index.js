const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const cors = require('cors')
require('dotenv').config()

mongoose.connection.on('error', function (err) {
  console.log(err)
})

mongoose.connect('mongodb://localhost/arena', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const corsOptions = {
  exposedHeaders: ['token'],
}
app.use(cors(corsOptions))

app.use(express.json())

app.use('/uploads', express.static('uploads'))

app.use('/', routes)

app.listen(process.env.PORT)
