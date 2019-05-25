import os from 'os'
import onShutdown from 'node-cleanup'
import app from './config/express'
import config from './config/config'
import logger from './config/logger'
import { registerJobs, shutdownJobs } from './config/jobs'


logger.info('############# simple mail service starting ############')

if ('test' !== config.get('env')) {
  // running with PM2
  if (process.env && process.env.NODE_APP_INSTANCE) {
    // running in pm2 (instance 0)
    if (process.env.NODE_APP_INSTANCE % os.cpus().length === 0) {
      registerJobs()
    }
  } else {
    // running without PM2
    registerJobs()
  }
}

app.listen(config.get('port'), () => {
  logger.info(`service running on port [${config.get('port')}], profile [${config.get('env')}]`)
})

onShutdown(async () => {
  logger.info('simple mail service shutting down...')
  shutdownJobs()
})

export default app