const ForbiddenError = require('../errors/forbiddenErr');
const NotFoundError = require('../errors/notFoundErr');
const Movies = require('../models/movies');
const { SUCCESS, CREATED } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movie) => {
      res.status(SUCCESS).send(movie);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: ownerId,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movies.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найдена');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Ошибка прав');
      }
      return Movies.deleteOne({ _id: req.params._id })
        .then(() => res.status(SUCCESS).send({ message: 'Фильм удален' }))
        .catch(next);
    })
    .catch(next);
};
