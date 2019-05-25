import convict from 'convict'
import path from 'path'
import appRoot from 'app-root-path'

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['local', 'development', 'test', 'production'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port'
  },
  messageStore: {
    doc: 'The message store type.',
    format: ['in-memory', 'persistent',],
    default: 'in-memory',
  },
  mailProvider: [{
    type: {
      doc: 'mailProvider type',
      format: ['primary', 'backup'],
      default: 'primary'
    },
    name: {
      doc: 'mailProvider name',
      format: String,
      default: ''
    },
    apiKey: {
      doc: 'Api Key',
      format: String,
      default: ''
    },
  }],
})

// allow override via command line
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

// load config.json parameters
config.loadFile(path.join(appRoot.path, './config/' + env + '.json'))
config.validate({allowed: 'strict'})

export default config
