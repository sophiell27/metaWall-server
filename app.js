var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./services/connectDB');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

connectDB();
var app = express();

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err.name);
  console.error('uncaughtException', err.message);
  console.error('uncaughtException', err.stack);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
});

process.on('unhandledRejection', (err, promise) => {
  console.log('err', err.name);
  console.log('err message', err.message);
  console.log('err stack', err.stack);
  console.log('unhandledRejection', promise);
});

module.exports = app;
