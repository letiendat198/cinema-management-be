import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// import "./cron/jobs.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";

// Import routes
import userRoutes from './routes/user.routes.js';
import movieRoutes from './routes/movie.routes.js';
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinemaDB'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.use(logger);

app.get("/", (req, res) => {
    res.send("Hello World")
})

// Routes
app.use('/user', userRoutes);
app.use('/movie', movieRoutes); 
app.use(errorHandler);

mongoose.connect(mongoURI,{})
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  }))
  .catch((err) => {
    console.error("Database connection error:", err)
  })