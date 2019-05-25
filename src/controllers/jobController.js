import moment from 'moment'
import logger from '../config/logger'
import config from '../config/config'
import getEmailStore from '../repositories/emailStoreProvider'
import { getPrimaryEmailProvider, getBackupEmailProvider } from '../services/emailProvider'

const MAX_DELIVERY_SIZE = 10

export const deliverEmails = async () => {

  try {
    logger.debug('started deliverEmails()')

    const emailStore = getEmailStore()
    const primaryEmailProvider = getPrimaryEmailProvider()
    const backupEmailProvider = getBackupEmailProvider()

    const failedEmailsToRetry = await getFailedEmailsToRetry(emailStore)
    const pendingEmails = await getPendingEmails(emailStore)
    const allEmails = [...pendingEmails, ...failedEmailsToRetry]

    logger.debug(`Found ${allEmails.length} emails(s) to deliver`)

    await Promise.all(allEmails.map(async item => {
      primaryEmailProvider.sendEmail(item.message)
        .then(async () => {
          logger.debug(`Successfully delivered email [${item.id}] via (PRIMARY)`)
          await emailStore.updateById({...item, status: 'COMPLETED', dateSent: new Date()})
        })
        .catch(() => {
          backupEmailProvider.sendEmail(item.message)
            .then(async () => {
              logger.debug(`Successfully delivered email [${item.id}] via (BACKUP)`)
              await emailStore.updateById({...item, status: 'COMPLETED', dateSent: new Date()})
            }).catch(async (err) => {
            logger.debug(`Failed to deliver email [${item.id}] [${err}]`)
            await emailStore.updateById({...item, status: 'FAILED', errorCount: item.errorCount + 1})
          })
        })
    }))
      .catch(err => logger.debug(err))

    logger.debug('finished deliverEmails()')

  } catch (err) {
    logger.error(`${err.stack}`)
  }
}

export const clearEmailStore = async () => {

  try {
    logger.debug('started clearEmailStore()')

    await getEmailStore().clearAll('COMPLETED')

    logger.debug('finished clearEmailStore()')
  } catch (err) {
    logger.error(`${err.stack}`)
  }
}

const getFailedEmailsToRetry = async (emailStore) => {
  const deliveryRetryCount = config.get('email.deliveryRetryCount')
  const deliveryRetryPeriod = config.get('email.deliveryRetryPeriod')
  const duration = moment.duration(deliveryRetryPeriod)
  const now = moment.now()

  const failed = (await emailStore.findByStatus('FAILED'))
    .filter(item => item.errorCount <= deliveryRetryCount)
    .filter(item => {
      const elapsedTime = new moment(item.dateCreated).add(duration.asMilliseconds() * item.errorCount)
      return elapsedTime.isBefore(now)
    })

  return failed.slice(0, Math.min(MAX_DELIVERY_SIZE, failed.length))
}

const getPendingEmails = async (emailStore) => {
  const pending = (await emailStore.findByStatus('PENDING'))
  return pending.slice(0, Math.min(MAX_DELIVERY_SIZE, pending.length))
}






