/**
 * Custom error class carrying an HTTP status code.
 * Throw this anywhere in a controller — the global error
 * middleware (middleware/errorMiddleware.js) knows how to render it.
 */
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
