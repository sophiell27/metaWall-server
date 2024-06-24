const appError = (statusCode, errorMessage) => {
  const error = new Error(errorMessage);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

module.exports = appError;
