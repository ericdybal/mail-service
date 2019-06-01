import convict from 'convict';
import path from 'path';
import appRoot from 'app-root-path';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['development', 'test', 'production', 'log'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
  },
  email: {
    retainPeriod: {
      doc: 'Retention period of FAILED and COMPLETED emails.',
      format: 'duration',
      default: '1 day',
    },
    deliveryRetryCount: {
      doc: 'The number of attempts to deliver a FAILED email.',
      format: 'int',
      default: 3,
    },
    deliveryRetryPeriod: {
      doc:
        'The elapsed time after an attempt will be made to deliver a FAILED email.',
      format: 'duration',
      default: '15 mins',
    },
  },
  emailStore: {
    type: {
      doc: 'The email store type.',
      format: ['in-memory', 'persistent'],
      default: 'in-memory',
    },
    size: {
      doc: 'The number of queued emails.',
      format: 'int',
      default: 10000,
    },
  },
  emailProvider: [
    {
      type: {
        doc: 'mailProvider type',
        format: ['primary', 'backup'],
        default: 'primary',
      },
      name: {
        doc: 'mailProvider name',
        format: String,
        default: '',
      },
      apiKey: {
        doc: 'Api Key',
        format: String,
        default: '',
      },
    },
  ],
});

// allow override via command line
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

// load config.json parameters
config.loadFile(path.join(appRoot.path, './config/' + env + '.json'));
config.validate({ allowed: 'strict' });

export default config;
