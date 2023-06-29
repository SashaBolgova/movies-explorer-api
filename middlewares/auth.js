require('dotenv').config();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const ERROR_401_MESSAGE = require('../utils/constants');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthtorizeUnauthorizedErrord(ERROR_401_MESSAGE);
    }
    const token = authorization.replace('Bearer ', '');

    req.user = jwt.verify(token, JWT_SECRET : 'secret-key');
    next();
  } catch (err) {
    next(new UnauthorizedError(ERROR_401_MESSAGE));
  }
};
