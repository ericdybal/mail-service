import logger from '../config/logger'
import { clearAll, findByStatus, updateById } from '../repositories/InMemoryQueue'
import * as primary from '../services/mailGunProvider'
import * as backup from '../services/sendGridProvider'

export const sendMail = async () => {

  const MAX_FETCH_COUNT = 10

  try {
    logger.debug('started sendMail()')

    const retryFailed = (await findByStatus('FAILED')).filter(item => item.errorCount < 3)
    const pending = await findByStatus('PENDING')

    const all = [...retryFailed.slice(0, Math.min(MAX_FETCH_COUNT, retryFailed.length)),
      ...pending.slice(0, Math.min(MAX_FETCH_COUNT, pending.length))]

    logger.debug(`Found ${all.length} email(s) to send`)

    all.map(async item => {

      primary.sendEmail(item.message)
        .then(async result => {

          await updateById({...item, status: 'COMPLETED', dateSent: new Date()})

        }).catch(err => {

        logger.debug(`Failed to relay email via the PRIMARY mailProvider [${err}]`)

        backup.sendEmail(item.message)
          .then(async result => {

            await updateById({...item, status: 'COMPLETED', dateSent: new Date()})

          }).catch(async err => {

          logger.debug(`Failed to relay email via the BACKUP mailProvider [${err}]`)
          await updateById({...item, status: 'FAILED', errorCount: item.errorCount + 1})
        })
      })
    })

    logger.debug('finished sendMail()')

  } catch (err) {
    logger.error(`${err.stack}`)
  }
}

export const clearMailQueue = async () => {

  try {
    logger.debug('started clearMailQueue()')

    await clearAll('COMPLETED')

    logger.debug('finished clearMailQueue()')
  } catch (err) {
    logger.error(`${err.stack}`)
  }
}








