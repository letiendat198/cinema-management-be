const express = require('express')
const movie_router = require('./routes/movie.router')

const app = express()
const port = 3000

app.use('/movie', movie_router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})