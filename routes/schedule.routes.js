import express from "express";
import {
  getSchedulesByMovieID,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getBookedSeats 
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.get("/:movieID", getSchedulesByMovieID);
router.post("/", addSchedule);
router.put("/:scheduleID", updateSchedule);
router.delete("/:scheduleID", deleteSchedule);

// Route to get booked seats for a specific schedule
router.get("/:scheduleID/booked-seats", getBookedSeats);

export default router;
