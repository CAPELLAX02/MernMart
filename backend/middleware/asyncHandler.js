/**
 * Middleware to handle asynchronous route handlers
 * @function asyncHandler
 * @param {Function} fn - The asynchronous function to handle
 * @returns {Function} Middleware function that handles errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
