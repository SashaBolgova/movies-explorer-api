const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, 'Минимальное количество букв в имени - 2'],
      maxLength: [30, 'Минимальное количество букв в имени - 30'],
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Поле email  должно быть заполнено'],
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Почта некорректна',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Данные пользователя не найдены'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Данные пользователя не найдены'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
