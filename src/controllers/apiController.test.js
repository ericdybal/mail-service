import { expect } from 'chai';
import status from 'http-status';
import request from 'supertest';
import app from '../config/express';
import { push, clearAll } from '../repositories/inMemoryEmailStore';

describe('apiController', () => {
  const mailEntry = {
    id: '1',
    status: 'PENDING',
    message: {
      from: 'test@example.com',
      to: 'guest@example.com',
      subject: 'Hi',
      text: 'Hello!',
    },
  };

  before(async () => {
    await push(mailEntry);
  });

  it('should return email delivery status', done => {
    request(app)
      .get('/api/mail/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(status.OK)
      .end((err, res) => {
        expect(res.body).to.eql(mailEntry);
        err ? done(err) : done();
      });
  });

  it('should return email not found', done => {
    request(app)
      .get('/api/mail/99999')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(status.NOT_FOUND)
      .end((err, res) => {
        expect(res.body).to.eql({ code: 404, message: 'Not found' });
        err ? done(err) : done();
      });
  });

  it('should successfully submit an email', done => {
    request(app)
      .post('/api/mail')
      .send({
        from: 'guest@example.com',
        to: 'test1@example.com,test2@example.com,wrong_email_address',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect('Location', /^\/api\/mail\/.*$/)
      .expect(status.CREATED)
      .end((err, res) => {
        expect(res.body.id).to.be.an('string');
        expect(res.body.dateCreated).to.be.an('string');
        expect(res.body.dateSent).to.equal(null);
        expect(res.body.status).to.equal('PENDING');
        expect(res.body.errorCount).to.equal(0);
        expect(res.body.message.from).to.equal('guest@example.com');
        expect(res.body.message.to).to.eql([
          'test1@example.com',
          'test2@example.com',
          'wrong_email_address',
        ]);
        expect(res.body.message.cc).to.eql(['cc@example.com']);
        expect(res.body.message.bcc).to.eql(['bcc@example.com']);
        err ? done(err) : done();
      });
  });

  it('should fail with the validation error', done => {
    request(app)
      .post('/api/mail')
      .send({ from: 'not_an_email_address,not_an_email_address2' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(status.BAD_REQUEST)
      .end((err, res) => {
        expect(res.body).to.eql({
          code: 400,
          message: 'validation errors',
          errors: [
            {
              location: 'body',
              msg: 'must be a valid email address',
              param: 'from',
              value: 'not_an_email_address,not_an_email_address2',
            },
            {
              location: 'body',
              msg: 'must be a valid email address',
              param: 'to',
            },
          ],
        });
        err ? done(err) : done();
      });
  });

  describe('Validate maximum queue size', () => {
    before(async () => {
      for (let i = 1; i < 110; i++) {
        await push(mailEntry);
      }
    });

    after(async () => {
      await clearAll();
    });

    it('should reject email if the queue size is exceeded', done => {
      request(app)
        .post('/api/mail')
        .send({
          from: 'guest@example.com',
          to: 'test@example.com',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/plain/)
        .expect(status.SERVICE_UNAVAILABLE)
        .end((err) => {
          err ? done(err) : done();
        });
    });
  });
});
