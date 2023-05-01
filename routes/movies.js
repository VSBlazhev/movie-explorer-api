const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { createMovieValidation, movieIdValidation } = require('../middlewares/moviesValidation');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:_id', movieIdValidation, deleteMovie);

module.exports = router;
