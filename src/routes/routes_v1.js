import express from 'express';
import * as controller from '../controllers/apiController';
import { validate } from '../util/validationUtils';
import validator from '../controllers/apiValidator';
import { catchErrors } from '../util/expressUtils';

const router = express.Router();

router.route('/').get((req, res) => {
  res.writeHead(301, { Location: `/api/api-docs` });
  res.end();
});

router.post('/mail', validate(validator.sendEmail), catchErrors(controller.sendEmail));
router.get('/mail/:id', validate(validator.getMail), catchErrors(controller.getEmail));

export default router;
