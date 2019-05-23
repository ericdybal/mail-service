import express from 'express'
import status from 'http-status'
import uuid from 'uuid'
import { push, findById } from '../repositories/InMemoryQueue'
import { validate } from '../util/validationUtils'
import validator from './apiValidator'

const router = express.Router()

router.post('/mail', validate(validator.sendEmail), (req, res, next) => {

  const mailEntry = {
    id: uuid(),
    dateCreated: new Date(),
    dateSent: null,
    status: 'PENDING',
    errorCount: 0,
    message: {
      from: req.body.from,
      to: req.body.to,
      cc: req.body.cc,
      bcc: req.body.bcc,
      subject: req.body.subject,
      text: req.body.text
    }
  }

  push(mailEntry).then(result => {
    res.status(status.CREATED)
    res.setHeader('Location', '/api/mail/' + result.id)
    res.send(result)
  }).catch(next)
})

router.get('/mail/:id', validate(validator.getMail), (req, res, next) => {
  const id = parseInt(req.params.id)

  findById(id).then(result => {
    res.status(result ? status.OK : status.NOT_FOUND)
      .send(result)
  }).catch(next)
})

export default router