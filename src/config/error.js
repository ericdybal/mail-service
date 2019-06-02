import httpStatus from 'http-status';

class APIError extends Error {
  constructor({ message, errors, status, isPublic, stack }) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status || httpStatus.INTERNAL_SERVER_ERROR;
    this.isPublic = isPublic;
    this.isOperational = true;
    this.stack = stack;
  }
}

export default APIError;
