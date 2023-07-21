/* eslint-disable no-console */

const router = require('express').Router();

const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

// const { cardValidate, cardIdValidate } = require('../middlewares/errorHandler');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
