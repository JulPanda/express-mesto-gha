/* eslint-disable no-console */
const express = require('express');

const mongoose = require('mongoose');

const { ERROR_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '64a3b97ed97ebabe6415bf9a',
    // _id: '64a3b97ed97ebabe5515bf9a',
  };

  next();
});

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый адрес не существует' });
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
