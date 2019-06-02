import { param, body } from 'express-validator/check';
import * as Validator from 'validator';
import { splitSanitizer, itemValidator, itemMessage } from '../util/validationUtils';

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
      .customSanitizer(splitSanitizer())
      .custom(itemValidator(Validator.isEmail))
      .withMessage(itemMessage('must be a valid email address')),

    body('cc')
      .optional()
      .customSanitizer(splitSanitizer())
      .custom(itemValidator(Validator.isEmail))
      .withMessage(itemMessage('must be a valid email address')),

    body('bcc')
      .optional()
      .customSanitizer(splitSanitizer())
      .custom(itemValidator(Validator.isEmail))
      .withMessage(itemMessage('must be a valid email address')),
  ],
};
