const express = require('express');

const movieRouter = express.Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const {
  validateMovieCreate, validateMovieDelete,
} = require('../middlewares/validation');

movieRouter.get('/', getMovies);

movieRouter.post('/', validateMovieCreate, createMovie);

movieRouter.delete('/:movieId', validateMovieDelete, deleteMovie);

module.exports = movieRouter;
