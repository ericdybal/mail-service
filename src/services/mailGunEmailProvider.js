import axios from 'axios'

let providerConfig

export const init = config => providerConfig = config

export const sendEmail = async (message) => {
  return axios({
    method: 'post',
    url: `https://api.mailgun.net/v3/sandbox3900691a3a094d2c861f477ec5acd14f.mailgun.org/messages`,
    auth: {
      username: 'api',
      password: providerConfig.apiKey,
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




