const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwttoken;
  let payload;
  try {
    if (!token) {
      next(new UnauthorizedError('Необходима авторизация'));
    } else {
      payload = jwt.verify(token, 'secret-key');
      // eslint-disable-next-line no-console
      // console.log(payload);
    }
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
