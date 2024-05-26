var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

dotenv.config({
  path: './config.env',
});

const { DATABASE, DATABASE_PASSWORD } = process.env;

const DB = DATABASE.replace('<password>', DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log('DB connected'))
  .catch(() => console.log('DB connect failed'));

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

module.exports = app;
