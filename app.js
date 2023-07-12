require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const { userRouter, movieRouter } = require('./routes/index');
const {
  createUser, login, signOut,
} = require('./controllers/users');
const {
  validateSignup, validateSignIn,
} = require('./middlewares/validation');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');

const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/not-found-err');
const { ERROR_404_MESSAGE, CRASH_SERVER } = require('./utils/constants');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Слушаем 3000 порт
const { PORT = 3001, LOCALHOST = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(LOCALHOST, {
  useNewUrlParser: true,
});

app.use(cors(
  {
    origin: ['http://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3000',
      'https://localhost:3001',
      'https://sashadiploma.nomoredomains.rocks',
      'http://sashadiploma.nomoredomains.rocks',
      'https://api.sashadiploma.nomoredomains.rocks',
      'http://api.sashadiploma.nomoredomains.rocks',
      'https://www.api.sashadiploma.nomoredomains.rocks',
      'http://www.api.sashadiploma.nomoredomains.rocks'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionSuccessStatus: 200,
  },
));

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(CRASH_SERVER);
  }, 0);
});

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignIn, login);
app.delete('/signout', signOut);

app.use(auth);
app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use(errorLogger);

app.use('*', (req, res, next) => next(new NotFoundError(ERROR_404_MESSAGE)));
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
