/* eslint-disable no-console */
const User = require('../models/user');
const {
  ERROR_NOT_FOUND, ERROR_SERVER, ERROR_INCORRECT_DATA, STATUS_OK, STATUS_CREATED,
} = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
        console.log(`err: ${err.message}, stack: ${err.stack}`);
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send(users);
    })
    .catch((err) => {
      res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
      console.log(`err: ${err.message}, stack: ${err.stack}`);
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'CastError') {
        res
          .status(ERROR_INCORRECT_DATA)
          .send({
            message: 'Некорректный id пользователя',
          });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
        console.log(`err: ${err.message}, stack: ${err.stack}`);
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(STATUS_OK).send({ user });
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
        console.log(`err: ${err.message}, stack: ${err.stack}`);
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании аватара' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Ошибка по умолчанию' });
        console.log(`err: ${err.message}, stack: ${err.stack}`);
      }
    });
};

module.exports = {
  createUser, getUsers, getUserById, updateUser, updateUserAvatar,
};
