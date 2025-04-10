import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getPopularMovies,
  getMoviesWithSchedules,
  incrementMovieViews,
  searchMovies
} from '../controllers/movie.controller.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/search', searchMovies);
router.get('/popular', getPopularMovies);
router.get('/genre', getMoviesByGenre);
router.get('/schedules', getMoviesWithSchedules);
router.get('/:movieID', getMovieById);
router.put('/:movieID/views', incrementMovieViews);
//admin
router.post('/', createMovie);
router.put('/:movieID', updateMovie);
router.delete('/:movieID', deleteMovie);

export default router;
