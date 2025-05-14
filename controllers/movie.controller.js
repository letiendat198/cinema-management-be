import { Movie } from '../models/movie.js';
import { Schedule } from '../models/schedule.js';
import { Room } from '../models/room.js';
import { Cinema } from '../models/cinema.js';
import { User } from '../models/user.js';
import ErrorHandler from "../utils/errorHandler.js";

export const getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ success: true, data: movies, message: 'New movie added successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const movie = await Movie.findByIdAndUpdate(
      movieID,
      { $inc: { view: 1 } },
      { new: true }
    );
    
    if (!movie) {
      return next(new ErrorHandler('Movie not found', 404));
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
      return next(new ErrorHandler('Movie not found', 404));
    }
    res.status(200).json({ success: true, data: movie, message: "Movie details updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const movie = await Movie.findByIdAndDelete(movieID);
    if (!movie) {
      return next(new ErrorHandler('Movie not found', 404));
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
    const movies = await Movie.find().sort({ like: -1, view: -1 }).limit(10);
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

export const getRecommendedMovies = async (req, res, next) => {
  try {
    const { userID } = req.params;
    
    if (!userID) {
      return next(new ErrorHandler('User ID is required', 400));
    }

    const user = await User.findById(userID).populate('watchHistory.movie');
    
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    // If user has no watch history, return popular movies instead
    if (!user.watchHistory || user.watchHistory.length === 0) {
      const popularMovies = await Movie.find().sort({ view: -1, like: -1 }).limit(10);
      return res.status(200).json({ 
        success: true, 
        data: popularMovies,
        message: 'Showing popular movies instead.'
      });
    }

    // Extract genres from user's watch history
    const userGenres = {};
    user.watchHistory.forEach(history => {
      if (history.movie && history.movie.genre) {
        if (userGenres[history.movie.genre]) {
          userGenres[history.movie.genre]++;
        } else {
          userGenres[history.movie.genre] = 1;
        }
      }
    });

    const sortedGenres = Object.keys(userGenres).sort((a, b) => userGenres[b] - userGenres[a]);
    
    const watchedMovieIds = user.watchHistory.map(history => history.movie._id.toString());
    
    const recommendedMovies = await Movie.find({
      genre: { $in: sortedGenres.slice(0, 3) }, 
      _id: { $nin: watchedMovieIds }
    }).limit(10);

    res.status(200).json({ 
      success: true, 
      data: recommendedMovies,
      preferredGenres: sortedGenres.slice(0, 3)
    });
  } catch (error) {
    next(error);
  }
};

export const incrementMovieLikes = async (req, res, next) => {
  try {
    const { movieID } = req.params;
    const movie = await Movie.findByIdAndUpdate(
      movieID,
      { $inc: { like: 1 } },
      { new: true }
    );
    if (!movie) {
      return next(new ErrorHandler('Movie not found', 404));
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
      return next(new ErrorHandler('Movie ID is required', 400));
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