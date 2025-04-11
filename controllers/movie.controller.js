import { Movie } from '../models/movie.js';
import { Schedule } from '../models/schedule.js';
import { Room } from '../models/room.js';
import { Cinema } from '../models/cinema.js';
export const getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const movie = await Movie.findById(movieID);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const movie = await Movie.findByIdAndUpdate(movieID, req.body, { new: true, runValidators: true });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const movie = await Movie.findByIdAndDelete(movieID);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMoviesByGenre = async (req, res, next) => {
  try {
    const { genre } = req.query;
    const movies = await Movie.find({ genre: genre });
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

export const getPopularMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ view: -1, like: -1 }).limit(10);
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

//để tăng view cho movie (kb có cách khác k)
export const incrementMovieViews = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const movie = await Movie.findByIdAndUpdate(
      movieID,
      { $inc: { view: 1 } },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};
// get all cinemas that are showing a specific movie
export const getCinemasByMovie = async (req, res, next) => {
  try {
    const { movieID } = req.query;

    if (!movieID) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    const roomIDs = await Schedule.distinct('roomID', { movieID });

    const cinemas = await Room.find({ _id: { $in: roomIDs } }).distinct('cinemaID');

    const cinemaDetails = await Cinema.find({ _id: { $in: cinemas } });

    res.status(200).json({ success: true, data: cinemaDetails });
  } catch (error) {
    next(error);
  }
};
export const searchMovies = async (req, res, next) => {
  try {
    const { query } = req.query;
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { actors: { $regex: query, $options: 'i' } }
      ],
    });
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};