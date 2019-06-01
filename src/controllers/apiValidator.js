import { param, body } from 'express-validator/check';

const splitter = (value = '') => value.split(',');

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
      .customSanitizer(splitter)
      .isEmail()
      .withMessage('must be a valid email address'),

    body('cc')
      .optional()
      .customSanitizer(splitter)
      .isEmail()
      .withMessage('must be a valid email address'),

    body('bcc')
      .optional()
      .customSanitizer(splitter)
      .isEmail()
      .withMessage('must be a valid email address'),
  ],
};
