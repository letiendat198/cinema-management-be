import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import "./cron/jobs.js";
const app = express()
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinemaDB'
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.get("/", (req, res) => {
    res.send("Hello World")
})
mongoose.connect(mongoURI,{})
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  }))
  .catch((err) => {
    console.error("Database connection error:", err)
  })