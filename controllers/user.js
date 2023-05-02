const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  SUCCESS,
  CREATED,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      name: user.name, email: user.email,
    }))
    .catch(next);
};

module.exports.patchUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(SUCCESS).send({ data: user }))
    .catch(next);
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'key');
      return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: 'Вы вошли' });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => res.status(SUCCESS).send({ data: user }))
    .catch(next);
};

module.exports.logOutUser = (req, res, next) => {
  try {
    res.clearCookie('jwt').send({ message: 'Вы вышли' });
  } catch (err) {
    next(err);
  }
};
