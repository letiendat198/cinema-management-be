import { Cinema } from '../models/cinema.js';
import { Movie } from '../models/movie.js';
import { Schedule } from '../models/schedule.js';
import { Room } from '../models/room.js';
import ErrorHandler from "../utils/errorHandler.js";

export const getAllCinemas = async (req, res, next) => {
  try {
    const cinemas = await Cinema.find();
    res.status(200).json({ success: true, data: cinemas });
  } catch (error) {
    next(error);
  }
};

export const getCinemaById = async (req, res, next) => {
  try {
    const { cinemaID } = req.params;
    const cinema = await Cinema.findById(cinemaID);
    if (!cinema) {
      return next(new ErrorHandler('Cinema not found', 404));
    }
    res.status(200).json({ success: true, data: cinema });
  } catch (error) {
    next(error);
  }
};

export const createCinema = async (req, res, next) => {
  try {
    const cinema = new Cinema(req.body);
    await cinema.save();
    res.status(201).json({ success: true, data: cinema });
  } catch (error) {
    next(error);
  }
};

export const updateCinema = async (req, res, next) => {
  try {
    const { cinemaID } = req.params;
    const cinema = await Cinema.findByIdAndUpdate(cinemaID, req.body, { new: true, runValidators: true });
    if (!cinema) {
      return next(new ErrorHandler('Cinema not found', 404));
    }
    res.status(200).json({ success: true, data: cinema });
  } catch (error) {
    next(error);
  }
};

export const deleteCinema = async (req, res, next) => {
  try {
    const { cinemaID } = req.params;
    const cinema = await Cinema.findByIdAndDelete(cinemaID);
    if (!cinema) {
      return next(new ErrorHandler('Cinema not found', 404));
    }
    res.status(200).json({ success: true, message: 'Cinema deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMoviebyCinema = async (req, res, next) => {
  try {
    const { cinemaID } = req.query;

    if (!cinemaID) {
      return next(new ErrorHandler('Cinema ID is required', 400));
    }

    const rooms = await Room.find({ cinemaID }).select('_id');
    const movieIDs = await Schedule.distinct('movieID', { roomID: { $in: rooms.map(room => room._id) } });
    const movies = await Movie.find({ _id: { $in: movieIDs } });

    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};
