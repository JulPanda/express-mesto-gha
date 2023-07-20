const { ERROR_SERVER } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  // const { statusCode = ERROR_SERVER, message } = err;

  res.status(err.statusCode).send({ message: err.statusCode === ERROR_SERVER ? 'Ошибка сервера' : err.message });
  // eslint-disable-next-line no-console
  console.log(err.statusCode, err.message);
  next();
};
module.exports = errorHandler;
