import { param, body } from 'express-validator/check';
import * as Validator from 'validator';
import { convertToArraySanitizer, arrayItemValidator, arrayItemMessage } from '../util/validationUtils';

export default {
  getMail: [
    param('id')
      .exists()
      .withMessage('is a required field'),
  ],
  sendEmail: [
    body('from')
      .isEmail()
      .withMessage('must be a valid email address'),

    body('to')
      .customSanitizer(convertToArraySanitizer())
      .custom(arrayItemValidator(Validator.isEmail))
      .withMessage(arrayItemMessage('must be a valid email address')),

    body('cc')
      .optional()
      .customSanitizer(convertToArraySanitizer())
      .custom(arrayItemValidator(Validator.isEmail))
      .withMessage(arrayItemMessage('must be a valid email address')),

    body('bcc')
      .optional()
      .customSanitizer(convertToArraySanitizer())
      .custom(arrayItemValidator(Validator.isEmail))
      .withMessage(arrayItemMessage('must be a valid email address')),
  ],
};
