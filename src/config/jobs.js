import schedule from 'node-schedule';
import moment from 'moment';
import logger from '../config/logger';
import config from '../config/config';
import { deliverEmails, clearEmailStore } from '../controllers/jobController';

const jobs = [];

export const registerJobs = () => {
  logger.info('starting background jobs');
  const retainPeriod = config.get('email.retainPeriod');
  const durationAsHours = moment.duration(retainPeriod).asHours();

  jobs.push(schedule.scheduleJob(`*/1 * * * *`, deliverEmails));
  jobs.push(
    schedule.scheduleJob(`* */${durationAsHours} * * *`, clearEmailStore)
  );
};

export const shutdownJobs = () => {
  logger.info('stopping background jobs');
  jobs.forEach(job => job.cancel());
};

export default schedule;
