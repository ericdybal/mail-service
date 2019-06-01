import httpStatus from 'http-status';
import { validationResult } from 'express-validator/check';
import APIError from './APIError';

export const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new APIError({
      message: 'validation errors',
      errors: errors.array(),
      status: httpStatus.BAD_REQUEST,
    });
  } else {
    return next();
  }
};

export const validate = fn => {
  const fns = Array.isArray(fn) ? fn : [fn];
  return [...fns, validateResults];
};
