/* eslint-disable no-console */
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const regexLink = /(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:@%+#?&/()*[],;=])+([a-zA-Z0-9]{1,6})([a-zA-Z0-9-._~:@%+#?&/()*[],;=])*/;

const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

// const { cardValidate, cardIdValidate } = require('../middlewares/errorHandler');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexLink),
  }),
}), createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
