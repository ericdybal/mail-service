import httpStatus from 'http-status';
import Error from '../config/error';
import config from '../config/config';
import logger from '../config/logger';

/* eslint-disable */
const errorHandler = (err, req, res, next) => {
  let convertedError = err;

  if (!(err instanceof Error)) {
    convertedError = new Error({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  const response = {
    code: convertedError.status,
    message: convertedError.message || httpStatus[convertedError.status],
    errors: convertedError.errors,
    stack: convertedError.stack,
  };

  logger.error(`[${convertedError.stack || convertedError.message}]`);

  if (config.get('env') !== 'development') {
    delete response.stack;
  }

  res.status(response.code);
  res.json(response);
};

export default errorHandler;
