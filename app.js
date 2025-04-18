import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// import "./cron/jobs.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import routes
import userRoutes from './routes/user.routes.js';
import movieRoutes from './routes/movie.routes.js';
import cinemaRoutes from './routes/cinema.routes.js';
import roomRoutes from './routes/room.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import seatRoutes from './routes/seat.routes.js';
import seatTypeRoutes from './routes/seattype.routes.js';
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinemaDB'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World")
})

// Routes
app.use('/user', userRoutes);
app.use('/movie', movieRoutes); 
app.use('/cinema', cinemaRoutes);
app.use('/room', roomRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/seat', seatRoutes);
app.use('/seattype', seatTypeRoutes);
app.use(errorHandler);

mongoose.connect(mongoURI,{})
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  }))
  .catch((err) => {
    console.error("Database connection error:", err)
  })