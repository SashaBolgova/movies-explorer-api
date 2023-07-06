require('dotenv').config();

const { JWT_SECRET = 'some-secret-key' } = process.env;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const ERROR_401_MESSAGE = require('../utils/constants');

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError(ERROR_401_MESSAGE);
    }
    const token = authorization.replace('Bearer ', '');

    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    next(new UnauthorizedError(ERROR_401_MESSAGE));
  }
};

module.exports = { auth };
