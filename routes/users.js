const express = require('express');

const userRouter = express.Router();

const {
  getUserInfo, updateUser,
} = require('../controllers/users');
const {
  validateUserUpdate,
} = require('../middlewares/validation');

userRouter.get('/me', getUserInfo);

userRouter.patch('/me', validateUserUpdate, updateUser);

module.exports = userRouter;
