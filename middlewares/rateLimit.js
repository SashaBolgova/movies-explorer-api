const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
