const successHandle = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: true,
    data,
  });
};

module.exports = successHandle;
