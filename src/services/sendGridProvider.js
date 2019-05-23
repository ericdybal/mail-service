import axios from 'axios'
import logger from '../config/logger'
import config from '../config/config'

export const sendEmail = async (message) => {
  logger.debug(`Relaying email [${JSON.stringify(message)}] via ${config.get('mailProvider.backup.name')}`)

  return axios({
    method: 'post',
    url: `https://api.sendgrid.com/v3/mail/send`,
    data: JSON.stringify(createPayload(message)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.get('mailProvider.backup.apiKey')}`
    }
  })
}

const createPayload = (message) => {
  return {
    personalizations: [{
      to: buildRecipients(message.to),
      cc: message.cc ? buildRecipients(message.cc) : undefined,
      bcc: message.bcc ? buildRecipients(message.bcc) : undefined,
      subject: message.subject
    }],
    from: {email: message.from},
    content: [{type: 'text/plain', value: message.text}]
  }
}

const buildRecipients = (arr) => {
  return arr.map(item => {
    return {
      email: item
    }
  })
}
