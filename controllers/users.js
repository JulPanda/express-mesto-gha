/* eslint-disable no-console */
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const CastError = require('../errors/incorrectDataError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');
const ForbiddenError = require('../errors/forbiddenError');

const { STATUS_OK, STATUS_CREATED } = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => {
      User.create({
        name, about, avatar, email, password: hashedPassword,
      })
        .then((user) => {
          res.status(STATUS_CREATED).send(user);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new CastError('Переданы некорректные данные при создании пользователя'));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new CastError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(STATUS_OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new CastError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new CastError('Переданы некорректные данные при создании аватара'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new UnauthorizedError('Введите данные'));
    return;
  }
  User.findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => {
      console.log(user);
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
          // создать токен
            const jwttoken = jwt.sign({
              _id: user._id,
            }, 'secret-key');
            // прикрепить его к куке
            res.cookie('jwttoken', jwttoken, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            res.send(user.toJSON());
          } else {
            next(new ForbiddenError('Не совпадает email или пароль'));
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, getUsers, getUserById, updateUser, updateUserAvatar, login,
};
