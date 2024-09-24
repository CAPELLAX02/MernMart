/**
 * Middleware to handle 404 Not Found errors
 * @function notFound
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found -  ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware to handle errors
 * @function errorHandler
 * @param {Object} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = `Resource not found`;
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? 'pancakes!' : err.stack,
  });
};

export { notFound, errorHandler };
