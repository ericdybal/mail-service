import winston, { format } from 'winston'
import appRootPath from 'app-root-path'
import path from 'path'

const options = {
  combined: {
    level: 'info',
    filename: `${appRootPath.path}/logs/combined.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  error: {
    level: 'error',
    filename: `${appRootPath.path}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

const logger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.prettyPrint(),
    format.label({label: path.basename(__filename)}),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.colorize(),
    format.printf(
      info =>
        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File(options.combined),
    new winston.transports.File(options.error),
  ],
})

//
// If we're not in production then log to the `console`
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console(options.console))
}

logger.stream = {
  write: (message) => {
    logger.info(message.trim())
  },
}

export default logger
