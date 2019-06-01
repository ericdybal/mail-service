import express from 'express';
import * as controller from '../controllers/apiController';
import { validate } from '../util/validationUtils';
import validator from '../controllers/apiValidator';
import { catchErrors } from '../util/expressUtils';

const router = express.Router();

router.route('/').get(controller.help);
router
  .route('/mail/:id')
  .get(validate(validator.getMail), catchErrors(controller.getEmail));
router
  .route('/mail')
  .post(validate(validator.sendEmail), catchErrors(controller.sendEmail));

export default router;
