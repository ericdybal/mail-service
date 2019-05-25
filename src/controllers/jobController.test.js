import sinon from 'sinon'
import { expect } from 'chai'
import { sendMail } from './jobController'
import { findById, push, clearAll } from '../repositories/inMemoryMessageStore'
import * as primary from '../services/mailGunProvider'
import * as backup from '../services/sendGridProvider'

describe('jobController', () => {
  const mailEntry = {
    id: 1,
    dateCreated: new Date(),
    status: 'PENDING',
    errorCount: 0,
    dateSend: null,
    message: {
      from: 'test@example.com',
      to: 'guest@example.com'
    }
  }

  const primaryStub = sinon.stub(primary, 'sendEmail')
  const backupStub = sinon.stub(backup, 'sendEmail')

  beforeEach(async () => {
    await clearAll();
  })

  it('should send email via backup mailProvider', async () => {
    primaryStub.rejects(new Error('provider is down'))
    backupStub.resolves({from: 'stub.from@exmaple.com', to: 'sub.to@example.com'})

    await push(mailEntry)
    await sendMail()

    expect(await findById(1)).to.have.property('status', 'COMPLETED')
    expect(await findById(1)).to.have.property('dateSent')
  })

  // it('should send email via primary mailProvider', async () => {
  //   primaryStub.resolves({from: 'stub.from@exmaple.com', to: 'sub.to@example.com'})
  //
  //   await push(mailEntry)
  //   await sendMail()
  //
  //   expect(await findById(1)).to.have.property('status', 'COMPLETED')
  //   expect(await findById(1)).to.have.property('dateSent')
  // })

})