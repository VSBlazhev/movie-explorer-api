const router = require('express').Router();
const {
  patchUserInfo,
  getCurrentUser,
} = require('../controllers/user');
const { patchInfoValidation } = require('../middlewares/userValidation');

router.patch('/me', patchInfoValidation, patchUserInfo);
router.get('/me', getCurrentUser);

module.exports = router;
