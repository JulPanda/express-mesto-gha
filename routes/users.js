/* eslint-disable no-console */

const router = require('express').Router();

const {
  // createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const {
  userIdValidate,
  userValidate,
  avatarValidate,
} = require('../middlewares/validation');

// router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', userIdValidate, getUserById);
router.patch('/me', userValidate, updateUser);
router.patch('/me/avatar', avatarValidate, updateUserAvatar);

module.exports = router;
