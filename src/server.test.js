import sinon from 'sinon';
import app from './config/express';
import logger from './config/logger';
import * as jobs from './config/jobs';
import start from './server';

describe('server.js', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(app, 'listen').callsFake(() => {
      logger.debug('running fake listener!');
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Local Deployment', () => {
    it('should run registerJob on startup', () => {
      const mock = sandbox
        .mock(jobs)
        .expects('registerJobs')
        .once()
        .returns(() => {});

      start();

      mock.verify();
    });
  });

  describe('PM2 Deployment', () => {
    beforeEach(() => {
      delete process.env['NODE_APP_INSTANCE'];
    });

    it('should run jobs on startup under PM2', () => {
      process.env['NODE_APP_INSTANCE'] = 0; // 1st node instance

      const mock = sandbox
        .mock(jobs)
        .expects('registerJobs')
        .once()
        .returns(() => {});

      start();

      mock.verify();
    });

    it('should NOT run jobs on startup under PM2', () => {
      process.env['NODE_APP_INSTANCE'] = 1; // 2nd node instance

      const mock = sandbox
        .mock(jobs)
        .expects('registerJobs')
        .never()
        .returns(() => {});

      start();

      mock.verify();
    });
  });

  // todo: test node-cleanup
  // it('should run shutdownJobs() on shutdown', () => {
  //   const mock = sandbox.mock(jobs)
  //     .expects('shutdownJobs')
  //     .once()
  //     .returns(() => {})
  //
  //   start()
  //
  //   mock.verify()
  // })
});
