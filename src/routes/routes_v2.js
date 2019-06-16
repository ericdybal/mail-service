import express from 'express';
import status from 'http-status';
import { validate } from '../util/validationUtils';
import validator from '../controllers/apiValidator';
import { catchErrors } from '../util/expressUtils';

const router = express.Router();

router.route('/').get((req, res) => {
  res.writeHead(301, { Location: `/api/api-docs` });
  res.end();
});

router.post('/mail', validate(validator.sendEmail), catchErrors(sendEmailV2));

async function sendEmailV2 (req, res) {
  res.status(status.OK)
    .json({ message: 'API V2 !' });
}

router.get('/mail/:id', validate(validator.getMail), catchErrors(getEmailV2));

async function getEmailV2 (req, res) {
  res.status(status.OK)
    .json({ message: 'API V2 !' });
}

export default router;
