import logger from '../config/logger';

const MAX_TEXT_LENGTH = 50;
/* eslint-disable */
let providerConfig;

export const init = config => (providerConfig = config);

export const sendEmail = async message => {
  logger.info(`
    FROM:     ${message.from}
    TO:       ${message.to.join(', ')}
    CC:       ${message.cc ? message.cc.join(', ') : ''}
    BCC:      ${message.bcc ? message.bcc.join(', ') : ''}
    SUBJECT:  ${limitText(message.subject)}
    TEXT:     ${limitText(message.text)}
  `);
  return Promise.resolve();
};

const limitText = text => {
  return text
    ? text.length > MAX_TEXT_LENGTH
      ? `${text.substr(0, MAX_TEXT_LENGTH - 1)}...`
      : text
    : '';
};
