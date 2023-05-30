module.exports = ((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : err.message,
    });
  next();
});
