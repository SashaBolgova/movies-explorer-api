require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const {
  ERROR_400_MESSAGE_USER,
  ERROR_404_MESSAGE_USER,
  ERROR_409_MESSAGE_USER,
  SUCCESS_MESSAGE_USER,
} = require('../utils/constants');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404_MESSAGE_USER);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_400_MESSAGE_USER));
      } else if (err.message === 'Пользователь не найден') {
        next(new NotFoundError(ERROR_404_MESSAGE_USER));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
            { expiresIn: '7d' },
          );

          res.status(201).send({ message: SUCCESS_MESSAGE_USER, token, email, name })
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(ERROR_400_MESSAGE_USER));
          } else if (err.code === 11000) {
            next(new ConflictError(ERROR_409_MESSAGE_USER));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.send({ message: SUCCESS_MESSAGE_USER, token, email: user.email, name: user.name });
    })
    .catch(next);
};

module.exports.signOut = (req, res) => {
  res.cookie('jwt', 'none', {
    maxAge: 3000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.send({ message: SUCCESS_MESSAGE_USER });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_404_MESSAGE_USER);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_400_MESSAGE_USER));
      } else if (err.code === 11000) {
        next(new ConflictError(ERROR_409_MESSAGE_USER));
      } else {
        next(err);
      }
    });
};
