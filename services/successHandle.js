const successHandle = (res, data, statusCode = 200, message) => {
  res.status(statusCode).json({
    status: true,
    data,
    ...(message && { message }),
  });
};

module.exports = successHandle;
