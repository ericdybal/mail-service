import httpStatus from 'http-status';
import { validationResult } from 'express-validator/check';
import Error from '../config/error';

export const validate = fn => {
  const fns = Array.isArray(fn) ? fn : [fn];
  return [...fns, validateResults];
};

export const validateResults = (req, res, next) => {
  const errorFormatter = ({ location, msg, param, value }) => {
    return {
      msg: msg,
      param: param,
      value: value,
      location: location,
    };
  };

  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return next(
      new Error({
        message: 'Validation errors',
        errors: errors.array(),
        status: httpStatus.BAD_REQUEST,
      })
    );
  } else {
    return next();
  }
};

//
// Converts delimiter separated string to an array e.g "item1,item2,item3 => [item1,item2,item3]"
//
export const convertToArraySanitizer = (delimiter = ',') => {
  return function(value = '') {
    return value.split(delimiter);
  };
};

//
// Validates elements of the passed in array. Stores the results of the validation in the
// res[location.path].failed array.
//
export const arrayItemValidator = validatorFn => {
  return function(values = [], { req, location, path }) {
    const failed = [];

    const array = Array.isArray(values) ? values : [values];
    array.forEach(item => {
      if (!validatorFn(item)) {
        failed.push(item);
      }
    });

    req[location][path].failed = failed;
    return failed.length === 0;
  };
};

//
// Builds a custom error message.
//
export const arrayItemMessage = message => {
  return function(value, { req, location, path }) {
    const invalid = req[location][path].failed || [];
    return `${message} [${invalid.join(',')}]`;
  };
};
