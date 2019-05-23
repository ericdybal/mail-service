import httpStatus from 'http-status'
import APIError from '../util/APIError'
import config from '../config/config'
import logger from '../config/logger'

export const handler = (err, req, res) => {
  logger.error(`Error [${JSON.stringify(err)}]`)

  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  }

  if (config.get('env') !== 'development') {
    delete response.stack
  }

  res.status(err.status)
  res.json(response)
}

export const converter = (err, req, res, next) => {
  let convertedError = err

  if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    })
  }

  return handler(convertedError, req, res)
}

export const notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  })
  return handler(err, req, res)
}

export default {
  handler,
  converter,
  notFound
}
