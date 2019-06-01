import sinon from 'sinon';
import { expect } from 'chai';
import moment from 'moment';
import { deliverEmails } from './jobController';
import { findById, push, clearAll } from '../repositories/inMemoryEmailStore';
import * as primary from '../services/mailGunEmailProvider';
import * as backup from '../services/sendGridEmailProvider';

describe('jobController', () => {
  const pending = {
    id: 1,
    dateCreated: new Date(),
    status: 'PENDING',
    errorCount: 0,
    dateSend: null,
    message: {
      from: 'test@example.com',
      to: 'guest@example.com',
    },
  };

  const failed = {
    id: 2,
    dateCreated: new moment().subtract(moment.duration(2, 'days')).toDate(),
    status: 'FAILED',
    errorCount: 1,
    dateSend: null,
    message: {
      from: 'test@example.com',
      to: 'guest@example.com',
    },
  };

  const primaryStub = sinon.stub(primary, 'sendEmail');
  const backupStub = sinon.stub(backup, 'sendEmail');

  beforeEach(async () => {
    await clearAll();
  });

  it('should send email via the primary email provider', async () => {
    primaryStub.resolves({
      from: 'stub.from@exmaple.com',
      to: 'sub.to@example.com',
    });

    await push(pending);
    await deliverEmails();

    expect(await findById(1)).to.have.property('status', 'COMPLETED');
    expect(await findById(1)).to.have.property('dateSent');
  });

  it('should send email via the backup email provider', async () => {
    primaryStub.rejects(new Error('provider is down'));
    backupStub.resolves({
      from: 'stub.from@exmaple.com',
      to: 'sub.to@example.com',
    });

    await push(pending);
    await deliverEmails();

    expect(await findById(1)).to.have.property('status', 'COMPLETED');
    expect(await findById(1)).to.have.property('dateSent');
  });

  it('should retry FAILED message', async () => {
    primaryStub.resolves({
      from: 'stub.from@exmaple.com',
      to: 'sub.to@example.com',
    });

    await push(failed);
    await deliverEmails();

    expect(await findById(2)).to.have.property('status', 'COMPLETED');
    expect(await findById(2)).to.have.property('dateSent');
  });
});
