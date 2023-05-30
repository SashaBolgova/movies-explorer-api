const express = require('express');

const userRouter = express.Router();

const {
  getUserInfo, updateUser,
} = require('../controllers/users');
const {
  validateUserInfo, validateUserUpdate,
} = require('../middlewares/validation');

userRouter.get('/me', validateUserInfo, getUserInfo);

userRouter.patch('/me', validateUserUpdate, updateUser);

module.exports = userRouter;
