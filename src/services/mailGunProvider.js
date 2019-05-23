import axios from 'axios'
import logger from '../config/logger'
import config from '../config/config'

export const sendEmail = async (message) => {
  logger.debug(`Relaying email [${JSON.stringify(message)}] via ${config.get('mailProvider.primary.name')}`)

  return axios({
    method: 'post',
    url: `https://api.mailgun.net/v3/sandbox3900691a3a094d2c861f477ec5acd14f.mailgun.org/messages`,
    auth: {
      username: 'api',
      password: config.get('mailProvider.primary.apiKey'),
    },
    params: {
      from: message.from,
      to: message.to.join(','),
      cc: message.cc ? message.cc.join(',') : undefined,
      bcc: message.bcc ? message.bcc.join(',') : undefined,
      subject: message.subject,
      text: message.text
    },
  })
}




