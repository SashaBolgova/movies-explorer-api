const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  ERROR_400_MESSAGE_MOVIE,
  ERROR_404_MESSAGE_MOVIE,
  ERROR_403_MESSAGE_MOVIE,
} = require('../utils/constants');

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400_MESSAGE_MOVIE));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERROR_404_MESSAGE_MOVIE);
      } else if (!(req.user._id === movie.owner._id.toString())) {
        throw new ForbiddenError(ERROR_403_MESSAGE_MOVIE);
      } else {
        movie.deleteOne()
          .then((myMovie) => {
            res.status(200).send(myMovie);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequestError(ERROR_400_MESSAGE_MOVIE);
            }
            next(err);
          });
      }
    })
    .catch(next);
};
