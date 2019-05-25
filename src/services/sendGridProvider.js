import axios from 'axios'
import logger from '../config/logger'

let providerConfig

export const init = config => providerConfig = config

export const sendEmail = async (message) => {
  logger.debug(`Relaying email [${JSON.stringify(message)}] via ${providerConfig.name} [${providerConfig.type.toUpperCase()}]`)

  return axios({
    method: 'post',
    url: `https://api.sendgrid.com/v3/mail/send`,
    data: JSON.stringify(createPayload(message)),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${providerConfig.apiKey}`
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
