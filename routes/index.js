/* eslint-disable no-console */
const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
