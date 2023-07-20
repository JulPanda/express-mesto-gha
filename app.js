/* eslint-disable no-console */

const express = require('express');

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const { login, createUser } = require('./controllers/users');
const { ERROR_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
// const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(cookieParser());
// router.post('/signin', login);
// router.post('/signup', createUser);

// router.use(auth);

app.use(router);
app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый адрес не существует' });
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
