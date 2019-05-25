import { expect } from 'chai'
import sinon from 'sinon'
import config from '../config/config'
import { getPrimaryEmailProvider, getBackupEmailProvider } from './emailProvider'
import * as mailGunEmailProvider from './mailGunEmailProvider'
import * as sendGridEmailProvider from './sendGridEmailProvider'

describe('emailProvider', () => {
  const configStub = sinon.stub(config, '_instance')

  it('should return primary email provider', () => {
    configStub.value({emailProvider: [{type: 'primary', name: 'mailGun'}]})
    expect(getPrimaryEmailProvider()).to.equal(mailGunEmailProvider)
  })

  it('should return backup email provider', () => {
    configStub.value({emailProvider: [{type: 'backup', name: 'sendGrid'}]})
    expect(getBackupEmailProvider()).to.equal(sendGridEmailProvider)
  })
})
