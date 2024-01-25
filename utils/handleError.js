function handleError(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const error = {
    message,
    statusCode
  };
  res.status(statusCode).json({ error });
}

module.exports = handleError;
