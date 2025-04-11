import express from 'express';
import {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
  getMoviebyCinema,
} from '../controllers/cinema.controller.js';

const router = express.Router();

router.get('/', getAllCinemas);
router.get('/:cinemaID', getCinemaById);
router.post('/', createCinema);
router.put('/:cinemaID', updateCinema);
router.delete('/:cinemaID', deleteCinema);
router.get('/:cinemaID/movies', getMoviebyCinema);
export default router;
