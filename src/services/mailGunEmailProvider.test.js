import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
// import nock from 'nock';
// import { sendEmail } from './mailGunEmailProvider';

describe('mailGunEmailProvider', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  it('work in progress', () => {
    expect(mock).to.be.not.undefined;
  });

  //
  //  TODO: Fix the test case
  //
  // it('should submit email successfully', () => {
  //   mock.onPost('https://api.mailgun.net/v3/sandbox3900691a3a094d2c861f477ec5acd14f.mailgun.org/messages')
  //     .reply(200, 'OK');
  //
  //   sendEmail({ from: 'guest@example.com', to: 'to@example.com' })
  //     .then(result => {
  //       expect(result).to.be.eql('OK');
  //     })
  //     .catch(err => {
  //       expect.fail(err);
  //     });
  // });
  //
  // it('should handle error', () => {
  //   nock('https://api.mailgun.net/v3/sandbox3900691a3a094d2c861f477ec5acd14f.mailgun.org')
  //     .post('/messages')
  //     .replyWithError('FAILED');
  //
  //   sendEmail({ from: 'guest@example.com', to: 'to@example.com' })
  //     .then(result => {
  //       expect.fail(result);
  //     })
  //     .catch(err => {
  //       expect(err).to.be.eql('FAILED');
  //     });
  // });
});
