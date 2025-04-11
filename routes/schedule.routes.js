import express from "express";
import {
  getSchedulesByMovieID,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.get("/:movieID", getSchedulesByMovieID);
router.post("/", addSchedule);
router.put("/:scheduleID", updateSchedule);
router.delete("/:scheduleID", deleteSchedule);

export default router;
