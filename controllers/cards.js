/* eslint-disable no-console */
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const CastError = require('../errors/incorrectDataError');
const ForbiddenError = require('../errors/forbiddenError');

const { STATUS_OK, STATUS_CREATED } = require('../utils/constants');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new CastError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_OK).send(cards);
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (String(card.owner) !== String(req.user._id)) {
        next(new ForbiddenError('Нельзя удалять чужую карточку'));
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.status(STATUS_OK).send(card);
          });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new CastError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(STATUS_OK).send(card);
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

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(STATUS_OK).send(card);
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

module.exports = {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
};
