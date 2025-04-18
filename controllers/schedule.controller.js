import { Schedule } from "../models/schedule.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getSchedulesByMovieID = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const schedules = await Schedule.find({ movieID }).populate("roomID");
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    next(error);
  }
};

export const addSchedule = async (req, res, next) => {
  try {
    const { movieID, roomID, startTime, endTime } = req.body;
    
    if (!movieID || !roomID || !startTime || !endTime) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    
    const newSchedule = new Schedule({ movieID, roomID, startTime, endTime });
    await newSchedule.save();
    res.status(201).json({ success: true, data: newSchedule });
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
      return next(new ErrorHandler("Schedule not found", 404));
    }
    res.status(200).json({ success: true, data: updatedSchedule });
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const { scheduleID } = req.params;
    const deletedSchedule = await Schedule.findByIdAndDelete(scheduleID);
    if (!deletedSchedule) {
      return next(new ErrorHandler("Schedule not found", 404));
    }
    res.status(200).json({ success: true, message: "Schedule deleted successfully" });
  } catch (error) {
    next(error);
  }
};
