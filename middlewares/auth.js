require('dotenv').config();

const { JWT_SECRET = 'some-secret-key' } = process.env;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const ERROR_401_MESSAGE = require('../utils/constants');

const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new UnauthorizedError(ERROR_401_MESSAGE);
    }


    req.user = jwt.verify(token, JWT_SECRET);
    next();

  } catch (err) {
    next(new UnauthorizedError(ERROR_401_MESSAGE));
  }
}

module.exports = { auth };
