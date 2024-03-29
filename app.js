const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('./middlewares/corsHandler');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { loginUser, createUser, logOutUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const errHandler = require('./middlewares/errHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_PRODUCTION = 'mongodb://localhost:27017/bitfilmsdbLOCAL' } = process.env;

const { loginValidation, createUserValidation } = require('./middlewares/userValidation');
const NotFoundError = require('./errors/notFoundErr');

const app = express();
app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_PRODUCTION);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', loginValidation, loginUser);
app.post('/signup', createUserValidation, createUser);
app.post('/signout', auth, logOutUser);

app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);

app.use('/*', auth, (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);

app.use(errors());
app.use(errHandler);
app.listen(PORT, () => {
  console.log('меня подняли');
});
