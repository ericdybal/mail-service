import { expect } from 'chai'
import sinon from 'sinon'
import config from '../config/config'
import { getPrimaryMailProvider, getBackupMailProvider } from './mailProvider'
import * as mailGunProvider from './mailGunProvider'
import * as sendGridProvider from './sendGridProvider'

describe('mailProvider', () => {
  const configStub = sinon.stub(config, '_instance')

  it('should return primary provider', () => {
    configStub.value({mailProvider: [{type: 'primary', name: 'mailGun'}]})
    expect(getPrimaryMailProvider()).to.equal(mailGunProvider)
  })

  it('should return backup provider', () => {
    configStub.value({mailProvider: [{type: 'backup', name: 'sendGrid'}]})
    expect(getBackupMailProvider()).to.equal(sendGridProvider)
  })
})
