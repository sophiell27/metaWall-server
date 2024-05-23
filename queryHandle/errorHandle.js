const errorHandle = (res, message = 'data is incorrect') => {
  res.status(400).json({
    status: false,
    message,
  });
};
module.exports = errorHandle;
