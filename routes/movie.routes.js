import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getPopularMovies,
  incrementMovieViews,
  searchMovies,
  getCinemasByMovie
} from '../controllers/movie.controller.js';

import { getSchedulesByMovieID } from '../controllers/schedule.controller.js';
const router = express.Router();

router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/popular', getPopularMovies);
router.get('/genre', getMoviesByGenre);
router.get('/:movieID', getMovieById);
// Get cinemas by movie ID
router.get('/:movieID/cinemas',getCinemasByMovie)
router.put('/:movieID/views', incrementMovieViews);
// Available schedules for a movie
router.get('/:movieID/schedules', getSchedulesByMovieID);
//admin
router.post('/', createMovie);
router.put('/:movieID', updateMovie);
router.delete('/:movieID', deleteMovie);
export default router;
