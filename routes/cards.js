/* eslint-disable no-console */
// const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

// const regexLink = /^(https?:\/\/)?[^\s]*\.(jpg|jpeg|png|gif|bmp|test)$/;

const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardValidate, cardIdValidate } = require('../middlewares/validation');

router.post('/', cardValidate, createCard);
router.get('/', getCards);
router.delete('/:cardId', cardIdValidate, deleteCardById);
router.put('/:cardId/likes', cardIdValidate, likeCard);
router.delete('/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = router;
