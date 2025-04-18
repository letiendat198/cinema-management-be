import { populate } from "dotenv";
import { Schedule } from "../models/schedule.js";

export const getSchedulesByMovieID = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const schedules = await Schedule.find({ movieID }).populate({
      path: 'roomID',
      populate: {
        path: 'cinemaID',
        model: 'Cinema'
      }
    });
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
};

export const addSchedule = async (req, res, next) => {
  try {
    const { movieID, roomID, startTime, endTime } = req.body;
    const newSchedule = new Schedule({ movieID, roomID, startTime, endTime });
    await newSchedule.save();
    res.status(201).json({ success: true, data: newSchedule, message: "New schedule added successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const { scheduleID } = req.params;
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleID,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    res.status(200).json({ success: true, data: updatedSchedule, message: "Schedule updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const { scheduleID } = req.params;
    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleID);
    if (!deletedSchedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
    res.status(200).json({ success: true, message: "Schedule deleted successfully" });
  } catch (error) {
    next(error);
  }
};
