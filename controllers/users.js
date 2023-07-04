const User = require('../models/user');
const { ERROR_NOT_FOUND, ERROR_SERVER, ERROR_INCORRECT_DATA } = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_SERVER).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(ERROR_SERVER).send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      } else {
        res.status(ERROR_SERVER).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      } else if (err.message.includes('Validation failed')) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_SERVER).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('Not Found'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      } else if (err.message.includes('Validation failed')) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании аватара' });
      } else {
        res.status(ERROR_SERVER).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  createUser, getUsers, getUserById, updateUser, updateUserAvatar,
};
