import schedule from 'node-schedule'
import logger from '../config/logger'
import { sendMail, clearMailQueue } from '../controllers/jobController'

const jobs = []

export const registerJobs = () => {
  logger.info('starting background jobs')
  jobs.push(schedule.scheduleJob('*/1 * * * *', sendMail))
  jobs.push(schedule.scheduleJob('* */24 * * *', clearMailQueue))
}

export const shutdownJobs = () => {
  logger.info('stopping background jobs')
  jobs.forEach(job => job.cancel())
}

export default schedule