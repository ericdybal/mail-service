import { expect } from 'chai';
import sinon from 'sinon';
import getEmailStore from './emailStoreProvider';
import * as inMemoryEmailStore from './inMemoryEmailStore';
import * as persistentEmailStore from './persistentEmailStore';
import config from '../config/config';

describe('emailStoreProvider', () => {
  let sandbox;
  let configStub;

  before(() => {
    sandbox = sinon.createSandbox();
    configStub = sandbox.stub(config, 'get');
  });

  after(() => {
    sandbox.restore();
  });

  it('should return in-memory email store', () => {
    configStub.returns('in-memory');
    expect(getEmailStore()).to.equal(inMemoryEmailStore);
  });

  it('should return persistent email store', () => {
    configStub.returns('persistent');
    expect(getEmailStore()).to.equal(persistentEmailStore);
  });
});
