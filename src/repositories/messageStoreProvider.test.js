import { expect } from 'chai'
import sinon from 'sinon'
import getMessageStore from './messageStoreProvider'
import * as inMemoryMessageStore from './inMemoryMessageStore'
import * as persistentMessageStore from './persistentMessageStore'
import config from '../config/config'

describe('messageStoreProvider', () => {
  const configStub = sinon.stub(config, 'get')

  it('in-memory message store', () => {
    configStub.returns('in-memory')
    expect(getMessageStore()).to.equal(inMemoryMessageStore)
  })

  it('persistent message store', () => {
    configStub.returns('persistent')
    expect(getMessageStore()).to.equal(persistentMessageStore)
  })
})
