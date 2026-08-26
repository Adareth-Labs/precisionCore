import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { env } from './env'

const { combine, timestamp, json, errors, colorize, simple } = winston.format

const fileTransport = new DailyRotateFile({
  dirname:       env.LOG_DIR,
  filename:      'api-%DATE%.log',
  datePattern:   'YYYY-MM-DD',
  maxFiles:      '30d',
  maxSize:       '100m',
  format:        combine(timestamp(), errors({ stack: true }), json()),
})

const errorTransport = new DailyRotateFile({
  dirname:   env.LOG_DIR,
  filename:  'error-%DATE%.log',
  datePattern:'YYYY-MM-DD',
  maxFiles:  '30d',
  level:     'error',
  format:    combine(timestamp(), errors({ stack: true }), json()),
})

export const logger = winston.createLogger({
  level:      env.LOG_LEVEL,
  transports: [
    fileTransport,
    errorTransport,
    ...(env.NODE_ENV !== 'production'
      ? [new winston.transports.Console({ format: combine(colorize(), simple()) })]
      : []),
  ],
})