import { populate } from "dotenv";
import { Schedule } from "../models/schedule.js";
import { Ticket } from "../models/ticket.js"; 
import ErrorHandler from "../utils/errorHandler.js";
import mongoose from 'mongoose';
import dayjs from "dayjs";

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
    
    if (!movieID || !roomID || !startTime || !endTime) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (!dayjs(startTime).isBefore(dayjs(endTime))) {
      return next(new ErrorHandler("Start time must happens before end time", 400));
    }

    const existedSchedule = await Schedule.find({roomID});
    for (let schedule of existedSchedule) {
      if (!(dayjs(schedule.startTime).isAfter(dayjs(endTime)) || dayjs(schedule.endTime).isBefore(dayjs(startTime)))) 
        return next(new ErrorHandler("New schedule for this room collides with another schedule", 409));
    }
    
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
      return next(new ErrorHandler("Schedule not found", 404));
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
      return next(new ErrorHandler("Schedule not found", 404));
    }
    res.status(200).json({ success: true, message: "Schedule deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get booked seats for a specific schedule
export const getBookedSeats = async (req, res, next) => {
  try {
    const { scheduleID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(scheduleID)) {
        return next(new ErrorHandler("Invalid schedule ID", 400));
    }

    const bookedTickets = await Ticket.find({
      showtime: scheduleID,
      status: 'booked'
    }).select('seatLabel -_id');

    const bookedSeatLabels = bookedTickets.map(ticket => ticket.seatLabel);

    res.status(200).json({ success: true, data: bookedSeatLabels });
  } catch (error) {
    next(error);
  }
};
