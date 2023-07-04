const Card = require('../models/card');
const { ERROR_NOT_FOUND, ERROR_SERVER, ERROR_INCORRECT_DATA } = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_SERVER).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(ERROR_SERVER).send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not Found'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемая карточка не найдена',
          });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Некорректный id пользователя' });
      } else {
        res.status(ERROR_SERVER).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Некорректный id пользователя' });
      } else {
        res.status(ERROR_SERVER).send({
          message: 'Ошибка по умолчанию',
          err: err.message,
          name: err.name,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new Error('Not Found'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT_DATA)
          .send({ message: 'Некорректный id пользователя' });
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
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
};
