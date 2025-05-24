var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const connectDB = require('./config/connectDB');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
const uploadRouter = require('./routes/upload');
const handleErrorAsync = require('./middlewares/handleErrorAsync');

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
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'development'
        ? process.env.DEV_CLIENT_URL
        : process.env.PROD_CLIENT_URL,
  }),
);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/upload', uploadRouter);

app.use((_, res) => {
  res.status(404).json({
    status: 'false',
    message: '404 route not found',
  });
});
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: false,
      message: 'data is incorrect',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  }
  res.status(404).json({
    status: false,
    message: err.message,
  });
});

process.on('unhandledRejection', (err, promise) => {
  console.log('err', err.name);
  console.log('err message', err.message);
  console.log('err stack', err.stack);
  console.log('unhandledRejection', promise);
});

module.exports = app;
