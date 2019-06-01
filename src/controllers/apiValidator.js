import { param, body } from 'express-validator/check';

const split = (value = '') => value.split(',');

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
      .customSanitizer(split)
      .isEmail()
      .withMessage('must be a valid email address'),

    body('cc')
      .optional()
      .customSanitizer(split)
      .isEmail()
      .withMessage('must be a valid email address'),

    body('bcc')
      .optional()
      .customSanitizer(split)
      .isEmail()
      .withMessage('must be a valid email address'),
  ],
};
