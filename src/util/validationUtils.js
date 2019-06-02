import httpStatus from 'http-status';
import { validationResult } from 'express-validator/check';
import APIError from './APIError';

export const validate = fn => {
  const fns = Array.isArray(fn) ? fn : [fn];
  return [...fns, validateResults];
};

export const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new APIError({
      message: 'Validation errors',
      errors: errors.array(),
      status: httpStatus.BAD_REQUEST,
    });
  } else {
    return next();
  }
};

//
// Custom sanitizers
//
export const splitSanitizer = (delimiter = ',') => {
  return function(value = '') {
    return value.split(delimiter);
  };
};

//
// Custom validators
//
export const itemValidator = (validatorFn) => {
  return function(values = []) {
    values.forEach(value => {
      if (!validatorFn(value)) {
        throw new Error(`${value} is not a valid email address`);
      }
    });
    return true;
  };
};

//
// Dynamic messages
//
export const itemMessage = (message) => {
  return function(value, { req, location, path }) {
    return req[location][path].length > 0 ? `Every element ${message}` : message;
  };
};
